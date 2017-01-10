import { Component, ViewChild, Inject  } from '@angular/core';
import { ViewController, ToastController, NavController,NavParams } from 'ionic-angular';
import { Http, Headers, RequestOptions  } from '@angular/http';
import * as moment from 'moment';

import { Item } from '../../Contracts/Item/Item';

import { ArraySortPipe } from '../../../utils/arraySort';
import * as consts from '../../../utils/Consts';
import { User } from '../../../utils/user';
import { SelectedItem } from '../../../utils/selecteditem';

@Component({
  selector: 'TaskItem',
  providers: [ArraySortPipe],
  templateUrl: 'TaskItem.html'
})
export class TaskItem {
  siteUrl : string;

  historyToggle : boolean = false;
  history : any;
  taskHistory : any;
  connectedItem : any;
  digest : Promise<any>;

  task : any;
  Title : string;
  Status : string;
  ContentType : string;
  startDate : string;
  deadLine : string;
  assignetTo : {Email : string, Title: string};
  taskAuthore : {EMail : string, Title: string};

  @ViewChild('coments') coments ;

  constructor(public navCtrl: NavController ,public viewCtrl: ViewController,public toastCtrl: ToastController,@Inject(SelectedItem) public selectedItem : SelectedItem, public navParams: NavParams, public http : Http, public user : User) {
    this.siteUrl = consts.siteUrl;
    this.task = navParams.data.item;
    this.Status = navParams.data.item.OData__Status || 'Done';
    this.ContentType =  navParams.data.item.TaskType ||  navParams.data.item.ContentType.Name;
    this.Title = navParams.data.item.Title || navParams.data.item.TaskTitle;
    this.startDate = navParams.data.item.StartDate;
    this.deadLine = navParams.data.item.TaskDueDate || navParams.data.item.DueDate;
    this.assignetTo = navParams.data.item.AssignetToEmail ? {Email: navParams.data.item.AssignetToEmail, Title: navParams.data.item.AssignetToTitle } : {Email: navParams.data.item.ExecutorEmail ,Title: navParams.data.item.NameExecutor};
    this.taskAuthore = navParams.data.item.TaskAuthore || {EMail :navParams.data.item.AthoreEmail,Title : navParams.data.item.NameAuthore };

    this.getTaskHistory();
    this.getConnectedDoc();
    this.digest = this.getDigest();
    console.log('this task',this.task);
  }

  ionViewDidLoad() {
      //  let listGet = `${consts.siteUrl}/Documents/lsi.listscollection.js`;

    //  let headers = new Headers({'Accept': 'application/json;odata=verbose'});
    //  let options = new RequestOptions({ headers: headers ,withCredentials: true});

    //  return this.http.get(listGet,options).toPromise()
    //  .then(res => {
    //     console.log('res data',res);
    //     //console.log('json data',res.json());
    //     let b = res.text();
    //     b = b.replace(/\'/g,`"`).replace(/;/g,'');
    //     console.log('b',b);
    //     let c = JSON.parse(b.substring(b.indexOf('LSi.ListsCollection = ')+'LSi.ListsCollection = '.length,b.length));
    //     console.log('c',c);
    //  })

  }

  dismiss(){
     this.viewCtrl.dismiss();
  }

  getDigest() : Promise<any> {
     let listGet = `${consts.siteUrl}/_layouts/15/viewlsts.aspx?view=14`;

     let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
     let options = new RequestOptions({ headers: headers });

     return this.http.get(listGet,options).toPromise()
        .then(res=>{
          let s:string = res.text();
          let v= "{\""+s.substring(s.indexOf(' '),s.indexOf('canUserCreateMicrosoftForm')-2)+"}"
          let obj = JSON.parse(v);
          return obj;
        })
        .catch( err =>{
          console.log('x-digest error',err);
        })
  }

  toworkTask(){
     console.log('to work');

      this.writeToHistory();

      let data = {
        "__metadata": {
            "type": "SP.Data.LSTasksListItem"
        },
        OData_Status : 'In Progress',
        AssignetToEmail : this.user.getEmail(),
        AssignetToTitle : this.user.getUserName(),
        AssignedToId : this.user.getId()
      }

      this.updateTaskData(this.task.Id,data)
        .then( (resdata)=> {
          console.log('post response',resdata);
          // GetCountNotStartedTask(LSOnlineTaskData.CurentUserEmail, 'Not Started', 0, 0, 0);
          // GetCountInWorkTask(LSOnlineTaskData.CurentUserEmail, 'In Progress', 0, 0, 0);
        })
  }

  cancelTask(){
     console.log('cancel work');
     //this.doneTask('RefuseTask');
  }

  executeTask(){
     console.log('execute task');

     if (this.ContentType == 'LSTaskResolution') {
      this.сheckResolution()
        .then( res => {
          console.log('resolution res',res);
          if (res.json().d.results.length !== 0) {
              this.doneTask('Done');
          } else {
              this.showToast('Вы не наложили не одной резолюции');
          }
        })
    } else {
      this.doneTask('Done');
    }

  }

  doneTask(taskResult : string) : void {

      let data = {
        "__metadata": {
            "type": "SP.Data.LSTasksListItem"
        },
        OData_Status : 'Done',
        OData__Comments : this.coments.value,
        TaskResults : taskResult
      }

      this.updateTaskData(this.task.Id,data)
        .then( ()=>{
            this.writeToHistoryAfterTaskDone();
           // addTaskNotificationButton();

          // GetCountNotStartedTask(LSOnlineTaskData.CurentUserEmail, 'Not Started', 0, 0, 0);
          // GetCountInWorkTask(LSOnlineTaskData.CurentUserEmail, 'In Progress', 0, 0, 0);
          // GetCountNotDoneTask(LSOnlineTaskData.CurentUserEmail, 'Done', 0, 0, 0);
        })
  }

  writeToHistoryAfterTaskDone() : void {
        let EvanteDate = moment.utc().format("DD.MM.YYYY HH:mm:ss");
        let StartDate = moment.utc(this.startDate).format("DD.MM.YYYY HH:mm:ss");
        let DueDate = moment.utc(this.deadLine).format("DD.MM.YYYY");

        let Event = 'Завершена задача';
        let EventType = 'EventDoneTask';

        if (this.ContentType == 'LSTaskAppruve') {
            if (this.task.TaskResults == 'Back') {
              Event = 'Получен отказ по задаче';
              EventType = 'EventBackTask';
            } else {
              Event = 'Получено согласие по задаче';
            }
        }
        if (this.ContentType == 'LSSTaskAdd') {
            EventType = 'EventDoneTask EventAddTask';
        }
        if (this.task.TaskResults == 'Delegate') {
            Event = `${this.user.getUserName()} делегировал задачу`;
            EventType = 'EventDelegateTask';
        }


        let StateInRouteData = {
        sysIDList : this.task.sysIDList,
        sysIDItem : this.task.sysIDItem,
        EventTypeUser : EventType,
        itemData : {
            ItemId: this.task.sysIDItem,
            ListID: this.task.sysIDList,
            ItemTitle: "-",
            ListTitle: "-",
            EventType: 'Task'
          },
        HistoryArray : [{
            EventType: EventType,
            Event: Event,
            NameExecutor: this.user.getUserName(),
            NameAuthore: this.taskAuthore.Title,
            TaskTitle: this.Title,
            StartDate: StartDate,
            DueDate: DueDate,
            StartDateSort: moment.utc(this.startDate).format("YYYYMMDD"),
            DueDateSort: moment.utc(this.deadLine).format("YYYYMMDD"),
            EvanteDate: EvanteDate,
            Comments: this.coments.value,
            TaskType: this.task.TaskType,
            TaskResult: this.ContentType,
            EndTask: '',
            ExecutorEmail: this.user.getEmail(),
            AthoreEmail: this.taskAuthore.EMail,
            ItemId: this.task.sysIDItem,
            ListID: this.task.sysIDList,
            TaskID: this.task.ID
          }],
          HistoryType : 'HistoryDataForUser'
        }

        // LSOnlineTaskData.LSDocsWriteRunRoute({
        //     Action: 'TaskDone',
        //     ListID: SelectData.d.results[0].sysIDList,
        //     ItemID: SelectData.d.results[0].sysIDItem,
        //     Type: 'Task',
        //     DataSource: {
        //       TaskResults: TaskResults,
        //       CurentTaskID: CurentTaskID,
        //       RelateListId: SelectData.d.results[0].sysIDList,
        //       RelateItem: SelectData.d.results[0].sysIDItem,
        //       Alert58: LSLang.Alert58,
        //       StateID: SelectData.d.results[0].StateID
        //     }
        // });

        this.updateHistory(StateInRouteData);
        StateInRouteData.HistoryType = 'TaskAndDocHistory';
        this.updateHistory(StateInRouteData);

        //LSOnlineTaskData.LSDocsStartWriteToHistory();

        // if (!!TypeAction) {
        //     TypeAction.Count++;
        //     LSCompliteGroupeAction(TypeAction);
        // } else {
        //     $('#LSPrelouderDiv').remove();
        // }
  }

  writeToHistory() : void {

          let EvanteDate = moment.utc().format("DD.MM.YYYY HH:mm:ss");
          let StartDate = moment.utc(this.startDate).format("DD.MM.YYYY HH:mm:ss");
          let DueDate = moment.utc(this.deadLine).format("DD.MM.YYYY");

          let StateInRouteData = {
            sysIDList : this.task.sysIDList,
            sysIDItem : this.task.sysIDItem,
            EventTypeUser : 'TaskInWork',
            itemData : {
              ItemId: this.task.sysIDList,
              ListID: this.task.sysIDItem,
              ItemTitle: "-",
              ListTitle: "-",
              EventType: 'Task'
            },
            HistoryArray : [{
              EventType: 'EventInWorkTask',
              Event: "Задача взята в работу",
              NameExecutor: this.user.getUserName(),
              NameAuthore: this.taskAuthore.Title,
              TaskTitle: this.Title,
              StartDate: StartDate,
              DueDate: DueDate,
              EvanteDate: EvanteDate,
              Comments: this.coments.value,
              ExecutorEmail: this.user.getEmail(),
              AthoreEmail: this.taskAuthore.EMail,
              TaskID: this.task.Id
            }],
            HistoryType : 'HistoryDataForUser'
          };

          this.updateHistory(StateInRouteData);
          StateInRouteData.HistoryType = 'TaskAndDocHistory';
          this.updateHistory(StateInRouteData);

          this.startWriteToHistory();

  }

  startWriteToHistory() : void {
     let listGet = `${consts.siteUrl}/_api/Web/Lists/GetByTitle('LSMainTransit')/items`;

     let headers = new Headers({'Accept': 'application/json;odata=verbose'});
     let options = new RequestOptions({ headers: headers });

     Promise.all([this.http.get(listGet,options).toPromise(),this.digest])
         .then( res =>{
            console.log('main transit res',res);
            res[0].json().d.results.map(item => {
               if(item.DataSource != 'true'){
                  let url = `${consts.siteUrl}/_api/Web/Lists/GetByTitle('LSMainTransit')/items`;
                  let body = {
                     __metadata : {
                        type : 'SP.Data.LSMainTransitItem'
                     },
                     DataSource : 'true'
                  }
                  let headers = new Headers({"X-RequestDigest":res[1].formDigestValue, "X-HTTP-Method":"MERGE","IF-MATCH": "*",'Accept': 'application/json;odata=verbose',"Content-Type": "application/json;odata=verbose"});
                  let options = new RequestOptions({ headers: headers });
                   this.http.post(url,JSON.stringify(body),options).toPromise();
               }
            })
         })
  }

  сheckResolution() : Promise<any>{
      let url =  `${consts.siteUrl}/_api/Web/Lists/GetByTitle('LSTasks')/items?$select=sysIDItem,ID,sysIDList,ContentTypeId,Title,TaskAuthore/Title,&$expand=TaskAuthore/Title,ContentType/Name&$filter=(sysIDItem eq '${this.task.sysIDItem}') and (sysIDList eq '${this.task.sysIDList}') and (ContentType/Name eq 'LSResolutionTaskToDo') and (TaskAuthore/Title eq '${encodeURI(this.taskAuthore.Title)}')`;

      let headers = new Headers({'Accept': 'application/json;odata=verbose'});
      let options = new RequestOptions({ headers: headers });

      return this.http.get(url,options).toPromise();
  }

  updateHistory(routeData : any) : Promise <any> {
    let url = `${consts.siteUrl}/_api/Web/Lists/GetByTitle('LSDocsListTransitHistory')/Items`;

    let body = {
      "__metadata": {
          type: "SP.Data.LSDocsListTransitHistoryItem"
      },
      Title : routeData.HistoryType,
      ListID : routeData.sysIDList,
      ItemID : routeData.sysIDItem,
      Type : routeData.EventTypeUser,
      historyData : JSON.stringify(routeData.HistoryArray),
      itemData : JSON.stringify(routeData.itemData)
    }

    // Authorization: "Bearer " + accessToken
    return this.digest.then(obj =>{
      let headers = new Headers({"Authorization":"Bearer "+'',"X-RequestDigest": obj.formDigestValue,'X-HTTP-Method':'MERGE','IF-MATCH': '*','Accept': 'application/json;odata=verbose',"Content-Type": "application/json;odata=verbose"});
      let options = new RequestOptions({ headers: headers });

      return this.http.post(url,JSON.stringify(body),options).toPromise().then(res=>{console.log('TransitHistory sucess')}).catch(err=>{console.log('LsTransiHistory error',err)})
   })

  }

  updateTaskData(id : number, data : any) : Promise<any> {
    let url = `${consts.siteUrl}/_api/Web/Lists/GetByTitle('LSTasks')/Items(${id})`;

   return  this.digest.then(obj =>{
       let headers = new Headers({"X-RequestDigest": obj.formDigestValue,'X-HTTP-Method':'MERGE','IF-MATCH': '*','Accept': 'application/json;odata=verbose',"Content-Type": "application/json;odata=verbose"});
       let options = new RequestOptions({ headers: headers });

       return this.http.post(url,JSON.stringify(data),options).toPromise().then(res=>{console.log('updateTask success',res)}).catch(err=>{console.log('updateTask error',err)});
    });
  }

  getTaskHistory() : void {
    let listGet = `${consts.siteUrl}/_api/Web/Lists/GetByTitle('LSHistory')/items?$filter=(ItemId eq '${this.task.sysIDItem || this.task.ItemId}') and (Title eq '${this.task.sysIDList || this.task.ListID}') and (ItemName eq 'Task')`;

    let headers = new Headers({'Accept': 'application/json;odata=verbose'});
    let options = new RequestOptions({ headers: headers });

    this.http.get(listGet,options)
        .toPromise()
        .then( res => {
          this.history = res.json().d.results[0] || {};

          if(this.history && this.history.propertyIsEnumerable('TaskHistory') ){
            this.taskHistory = JSON.parse(this.history.TaskHistory).map( task => {
              task.EvanteDate = task.EvanteDate.substring(0,10).split('.').reverse().join('-') + task.EvanteDate.substring(10,task.EvanteDate.length);
              return task;
           });
          }
        })
        .catch(error => {
          console.error('<TaskItem> Loading History error!',error);
          this.history = [];
        })
  }

  getConnectedDoc() : void {
     let listGet = `${consts.siteUrl}/_api/Web/Lists(guid'${this.task.sysIDList || this.task.ListID}')/items(${this.task.sysIDItem || this.task.ItemId})`;

     let headers = new Headers({'Accept': 'application/json;odata=verbose'});
     let options = new RequestOptions({ headers: headers });

     this.http.get(listGet,options)
         .toPromise()
         .then(res =>{
            this.connectedItem = res.json().d;
         })
         .catch(error => {
            console.log('There is no connected doc',error);
         })
  }

  showToast(message: any){
      let toast = this.toastCtrl.create({
        message: (typeof message == 'string' )? message : message.toString().substring(0,( message.toString().indexOf('&#x') || message.toString().length)) ,
        position: 'bottom',
        showCloseButton : true,
        duration: 9000
      });
    toast.present();
  }

  showHistory() : void{
    if(this.historyToggle){
      this.historyToggle = false;
      return;
    }
    this.historyToggle = true;
  }

  openConnecedItem() : void {
     this.selectedItem.set(this.connectedItem, this.task.sysIDList || this.task.ListID);
     this.navCtrl.push(Item, {
      item: this.connectedItem,
      listGUID : this.task.sysIDList || this.task.ListID
     });
  }

}
