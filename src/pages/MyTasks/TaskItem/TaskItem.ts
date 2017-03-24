import { Component, ViewChild, Inject  } from '@angular/core';
import { ViewController,LoadingController,Platform, ToastController, NavController,NavParams, Events } from 'ionic-angular';
import { Http, Headers, RequestOptions  } from '@angular/http';
import * as moment from 'moment';

import { Item } from '../../Contracts/Item/Item';

import { ArraySortPipe } from '../../../utils/arraySort';
import * as consts from '../../../utils/Consts';
import { User } from '../../../utils/user';
import { Access } from '../../../utils/access';
import { SelectedItem } from '../../../utils/selecteditem';
import { Loader } from '../../../utils/loader';
import { Images } from '../../../utils/images';

@Component({
  selector: 'TaskItem',
  providers: [ArraySortPipe],
  templateUrl: 'TaskItem.html'
})
export class TaskItem {
  siteUrl : string;
  loader : any;

  historyToggle : boolean = false;
  typingComment : boolean = false;
  history : any;
  taskHistory : any;
  connectedItem : any;
  digest : string;
  access_token : string;

  task : any;
  Title : string;
  Status : string;
  ContentType : string;
  startDate : string;
  deadLine : string;
  assignetTo : {Email : string, Title: string};
  taskAuthore : {EMail : string, Title: string};

  @ViewChild('coments') coments;
  @ViewChild('myFooter') footer;
  @ViewChild('middlelabel') middlelabel;
  scrollHeight : any;

  constructor(public platform: Platform,public navCtrl: NavController,@Inject(Images) public images: Images ,@Inject(Loader) public loaderctrl: Loader,public events: Events, public viewCtrl: ViewController,public loadingCtrl: LoadingController,public toastCtrl: ToastController,@Inject(Access) public access: Access,@Inject(SelectedItem) public selectedItem : SelectedItem, public navParams: NavParams,@Inject(Http) public http : Http,@Inject(User) public user : User) {
    this.siteUrl = consts.siteUrl;
    this.task = navParams.data.item;
    this.Status = navParams.data.item.OData__Status || 'Done';
    this.ContentType =  navParams.data.item.TaskType ||  navParams.data.item.ContentType.Name || "undefined";
    this.Title = navParams.data.item.Title || navParams.data.item.TaskTitle;
    this.startDate = navParams.data.item.StartDate_view;
    this.deadLine = navParams.data.item.TaskDueDate_view || navParams.data.item.DueDate_view;
    this.assignetTo = navParams.data.item.AssignetToEmail ? {Email: navParams.data.item.AssignetToEmail, Title: navParams.data.item.AssignetToTitle } : {Email: navParams.data.item.ExecutorEmail ,Title: navParams.data.item.NameExecutor};
    this.taskAuthore = navParams.data.item.TaskAuthore || {EMail :navParams.data.item.AthoreEmail,Title : navParams.data.item.NameAuthore };

    this.getTaskHistory();
    this.getConnectedDoc();
    access.getDigestValue().then(digest => this.digest = digest);
    access.getToken().then(token => this.access_token = token);
  }

  ionViewDidLoad(){
    this.platform.registerBackButtonAction((e)=>{this.dismiss();return false;},100);
    if(this.footer)
      this.scrollHeight = this.footer.nativeElement.offsetTop-this.footer.nativeElement.offsetHeight-this.middlelabel.nativeElement.offsetTop-this.middlelabel.nativeElement.offsetHeight + "px";
    else 
      this.scrollHeight = "60%";
  }

  ionViewDidEnter(){
    this.platform.registerBackButtonAction((e)=>{this.dismiss();return false;},100);
  }
  
  ionViewCanLeave(){
    this.platform.registerBackButtonAction((e)=>{this.platform.exitApp();return false;},100);
  }

  dismiss(){
     this.viewCtrl.dismiss();
  }

  public toWorkTask() : void {
      this.loaderctrl.presentLoading();

      let data = {
        "__metadata": {
            "type": "SP.Data.LSTasksListItem"
        },
        OData__Status : 'In Progress',
        AssignetToEmail : this.user.getEmail(),
        AssignetToTitle : this.user.getUserName(),
        AssignedToId : this.user.getId()
      }

      Promise.all([ this.writeToHistoryAfterTaskGet(),this.updateTaskData(this.task.Id,data)])
        .then( (resdata)=> {
          console.log('<TaskItem> toWorkTask')
          this.events.publish('task:checked');
          this.events.publish('task:towork');
          this.loaderctrl.stopLoading().then(()=>{this.dismiss();});
        })
        .catch(err=> {
          console.log('<TaskItem> toWorkTask error',err);
          this.showToast('Операция неуспешна.Произошла ошибка');
          this.loaderctrl.stopLoading().then(()=>{this.dismiss();});
        })
  }

  public cancelTask() : void {
     this.loaderctrl.presentLoading();
     this.doneTask('RefuseTask');
  }

  public executeTask() : void {
     this.loaderctrl.presentLoading();

     if (this.ContentType == 'LSTaskResolution') {
      this.сheckResolution()
        .then( res => {
          if (res.json().d.results.length !== 0) {
              this.doneTask('Done');
          } else {
              this.showToast('Вы не наложили не одной резолюции');
              this.loaderctrl.stopLoading();
          }
        })
    } else {
      this.doneTask('Done');
    }
  }

  private doneTask(taskResult : string) : void {
      let data = {
        "__metadata": {
            "type": "SP.Data.LSTasksListItem"
        },
        OData__Status : 'Done',
        OData__Comments : this.coments.value,
        TaskResults : taskResult
      }

      Promise.all([this.writeToHistoryAfterTaskDone(),this.updateTaskData(this.task.Id,data)])
        .then( ()=>{
          console.log('<TaskItem> done Task')
          this.events.publish('task:checked');
          this.events.publish('task:doneTask');
          this.loaderctrl.stopLoading().then(()=>{this.dismiss();});
        })
        .catch(err=>{
          console.log('<TaskItem> doneTask error',err);
          this.showToast('Операция неуспешна.Произошла ошибка');
          this.loaderctrl.stopLoading().then(()=>{this.dismiss();});
        })
  }

  private writeToHistoryAfterTaskDone() : Promise<any> {
        let EvanteDate = moment.utc().format("DD.MM.YYYY HH:mm:ss");
        let StartDate = moment.utc(this.task.startDate).format("DD.MM.YYYY HH:mm:ss");
        let DueDate = moment.utc(this.task.TaskDueDate).format("DD.MM.YYYY")

        let Event = 'Завершена задача';//LSLang.Alert60
        let EventType = 'EventDoneTask';

        if (this.ContentType == 'LSTaskAppruve') {
            if (this.task.TaskResults == 'Back') {
              Event = 'Получен отказ по задаче';//LSLang.Alert66
              EventType = 'EventBackTask';
            } else {
              Event = 'Получено согласие по задаче';//LSLang.Alert62
            }
        }
        if (this.ContentType == 'LSSTaskAdd') {
            EventType = 'EventDoneTask EventAddTask';
        }
        if (this.task.TaskResults == 'Delegate') {
            Event = `${this.user.getUserName()} делегировал задачу`;//LSLang.Alert67
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
            StartDateSort: moment.utc(this.task.StartDate).format("YYYYMMDD"),
            DueDateSort: moment.utc(this.task.TaskDueDate).format("YYYYMMDD"),
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

        let transitTaskData = {
            Title: 'TaskDone',
            ListID: this.task.sysIDList,
            ItemID: this.task.sysIDItem,
            Type: 'Task',
            DataSource: {
              TaskResults: this.ContentType,
              CurentTaskID: this.task.Id,
              RelateListId: this.task.sysIDList,
              RelateItem: this.task.sysIDItem,
              Alert58: "Автоматически закрыта задача",//LSLang.Alert58
              StateID: this.task.StateID
            }
         }

        return Promise.all([this.updateTransitTask(transitTaskData),this.updateTransitHistory(StateInRouteData),this.updateTransitHistory(StateInRouteData,'TaskAndDocHistory')])
          .then(()=>{
            return this.startWriteToHistory();
          })
          .catch(err=>{
              console.log('<TaskItem> writeToHistoryAfterTaskDone error',err);
              throw new Error('writeToHistoryAfterTaskDone error');
          })
  }

  private writeToHistoryAfterTaskGet() : Promise<any> {
          let EvanteDate = moment.utc().format("DD.MM.YYYY HH:mm:ss");
          let StartDate = moment.utc(this.task.StartDate).format("DD.MM.YYYY HH:mm:ss");
          let DueDate = moment.utc(this.task.TaskDueDate).format("DD.MM.YYYY");

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

         return Promise.all([this.updateTransitHistory(StateInRouteData),this.updateTransitHistory(StateInRouteData,'TaskAndDocHistory')])
            .then(()=>{
              return this.startWriteToHistory();
            })
            .catch(err=>{
              console.log('<TaskItem> writeToHistory error',err);
              throw new Error('writeToHistory error');
            })
  }

  private startWriteToHistory() : Promise<any> {
     let listGet = `${consts.siteUrl}/_api/Web/Lists/GetByTitle('LSMainTransit')/items`;

     let headers = new Headers({'Accept': 'application/json;odata=verbose','Authorization':`Basic ${btoa(window.localStorage.getItem('username')+':'+window.localStorage.getItem('password'))}`});
     let options = new RequestOptions({ headers: headers });

     return this.http.get(listGet,options).timeout(consts.timeoutDelay).retry(consts.retryCount).toPromise()
         .then( res =>{
           return res.json().d.results.map(item => {
               if(item.DataSource != 'true'){
                  let url = `${consts.siteUrl}/_api/Web/Lists/GetByTitle('LSMainTransit')/items(${item.Id})`;
                  let body = {
                     __metadata : {
                        type : 'SP.Data.LSMainTransitItem'
                     },
                     DataSource : 'true'
                  }
                  let headers = new Headers({"Authorization":(consts.OnPremise? `Basic ${btoa(window.localStorage.getItem('username')+':'+window.localStorage.getItem('password'))}` : `Bearer ${this.access_token}`),"X-RequestDigest":this.digest, "X-HTTP-Method":"MERGE","IF-MATCH": "*",'Accept': 'application/json;odata=verbose',"Content-Type": "application/json;odata=verbose"});
                  let options = new RequestOptions({ headers: headers });
                  return this.http.post(url,JSON.stringify(body),options).timeout(consts.timeoutDelay).retry(consts.retryCount).toPromise().catch(err=>{console.log('post maint trasit error',err)});
               }
            })
         })
         .catch(err=>{
           console.log(`<TaskItem> Error startWtriteToHistory 'LSMainTransit'`,err);
           throw new Error('startWriteToHistory error');
         })
  }

  private сheckResolution() : Promise<any>{
      let url =  `${consts.siteUrl}/_api/Web/Lists/GetByTitle('LSTasks')/items?$select=sysIDItem,ID,sysIDList,ContentTypeId,Title,TaskAuthore/Title,&$expand=TaskAuthore/Title,ContentType/Name&$filter=(sysIDItem eq '${this.task.sysIDItem}') and (sysIDList eq '${this.task.sysIDList}') and (ContentType/Name eq 'LSResolutionTaskToDo') and (TaskAuthore/Title eq '${encodeURI(this.taskAuthore.Title)}')`;

      let headers = new Headers({'Accept': 'application/json;odata=verbose','Authorization':`Basic ${btoa(window.localStorage.getItem('username')+':'+window.localStorage.getItem('password'))}`});
      let options = new RequestOptions({ headers: headers });

      return this.http.get(url,options).timeout(consts.timeoutDelay).retry(consts.retryCount).toPromise();
  }

  private updateTransitTask(taskData) : Promise<any> {
    taskData.DataSource.Alert57 = "Назначена задача";
    taskData.DataSource.Alert58 = "Автоматически закрыта задача";
    taskData.DataSource.Alert60 = "Завершена задача";
    taskData.DataSource.Alert62 = "Получено согласие по задаче";
    taskData.DataSource.Alert66 = "Получен отказ по задаче";

    taskData.DataSource = JSON.stringify(taskData.DataSource);

    taskData.__metadata = {
      type: "SP.Data.LSDocsListTransitTasksItem"
    }

    let url = `${consts.siteUrl}/_api/Web/Lists/GetByTitle('LSDocsListTransitTasks')/Items`;

    let headers = new Headers({"Authorization":(consts.OnPremise?`Basic ${btoa(window.localStorage.getItem('username')+':'+window.localStorage.getItem('password'))}` : `Bearer ${this.access_token}`),"X-RequestDigest": this.digest,'X-HTTP-Method':'POST','IF-MATCH': '*','Accept': 'application/json;odata=verbose',"Content-Type": "application/json;odata=verbose"});
    let options = new RequestOptions({ headers: headers });

    return this.http.post(url,JSON.stringify(taskData),options).timeout(consts.timeoutDelay).retry(consts.retryCount).toPromise();
  }

  private updateTransitHistory(routeData : any, historyType? : string) : Promise <any> {
    let url = `${consts.siteUrl}/_api/Web/Lists/GetByTitle('LSDocsListTransitHistory')/Items`;

    let body = {
      "__metadata": {
          type: "SP.Data.LSDocsListTransitHistoryItem"
      },
      Title : historyType ? historyType : routeData.HistoryType,
      ListID : routeData.sysIDList,
      ItemID : routeData.sysIDItem,
      Type : routeData.EventTypeUser,
      historyData : JSON.stringify(routeData.HistoryArray),
      itemData : JSON.stringify(routeData.itemData)
    }

      let headers = new Headers({"Authorization":(consts.OnPremise?`Basic ${btoa(window.localStorage.getItem('username')+':'+window.localStorage.getItem('password'))}`:`Bearer ${this.access_token}`),"X-RequestDigest": this.digest,'X-HTTP-Method':'POST','IF-MATCH': '*','Accept': 'application/json;odata=verbose',"Content-Type": "application/json;odata=verbose"});
      let options = new RequestOptions({ headers: headers });

      return this.http.post(url,JSON.stringify(body),options).timeout(consts.timeoutDelay).retry(consts.retryCount).toPromise();
  }

  private updateTaskData(id : number, data : any) : Promise<any> {
    let url = `${consts.siteUrl}/_api/Web/Lists/GetByTitle('LSTasks')/Items(${id})`;

    let headers = new Headers({"Authorization":(consts.OnPremise?`Basic ${btoa(window.localStorage.getItem('username')+':'+window.localStorage.getItem('password'))}`:`Bearer ${this.access_token}`),"X-RequestDigest": this.digest,'X-HTTP-Method':'MERGE','IF-MATCH': '*','Accept': 'application/json;odata=verbose',"Content-Type": "application/json;odata=verbose"});
    let options = new RequestOptions({ headers: headers });

    return this.http.post(url,JSON.stringify(data),options).timeout(consts.timeoutDelay).retry(consts.retryCount).toPromise();
  }


  private getTaskHistory() : Promise<any> {
    let listGet = `${consts.siteUrl}/_api/Web/Lists/GetByTitle('LSHistory')/items?$filter=(ItemId eq '${this.task.sysIDItem || this.task.ItemId}') and (Title eq '${this.task.sysIDList || this.task.ListID}') and (ItemName eq 'Task')`;

    let headers = new Headers({'Accept': 'application/json;odata=verbose','Authorization':`Basic ${btoa(window.localStorage.getItem('username')+':'+window.localStorage.getItem('password'))}`});
    let options = new RequestOptions({ headers: headers });

    return this.http.get(listGet,options).timeout(consts.timeoutDelay).retry(consts.retryCount)
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

  private getConnectedDoc() : void {
     let listGet = `${consts.siteUrl}/_api/Web/Lists(guid'${this.task.sysIDList || this.task.ListID}')/items(${this.task.sysIDItem || this.task.ItemId})`;

     let headers = new Headers({'Accept': 'application/json;odata=verbose','Authorization':`Basic ${btoa(window.localStorage.getItem('username')+':'+window.localStorage.getItem('password'))}`});
     let options = new RequestOptions({ headers: headers });

     this.http.get(listGet,options).timeout(consts.timeoutDelay).retry(consts.retryCount)
         .toPromise()
         .then(res =>{
            this.connectedItem = res.json().d;
         })
         .catch(error => {
            console.log('There is no connected doc',error);
         })
  }

  public showToast(message: any) : void {
      let toast = this.toastCtrl.create({
        message: (typeof message == 'string' )? message : message.toString().substring(0,( message.toString().indexOf('&#x') || message.toString().length)) ,
        position: 'bottom',
        showCloseButton : true,
        duration: 9000
      });
    toast.present();
  }

  public showHistory() : void{
    if(this.historyToggle){
      this.historyToggle = false;
      return;
    }
    this.historyToggle = true;
  }

  public openConnecedItem() : void {
     this.selectedItem.set(this.connectedItem, this.task.sysIDList || this.task.ListID);
     this.navCtrl.push(Item, {
      item: this.connectedItem,
      listGUID : this.task.sysIDList || this.task.ListID
     });
  }

  onFocus(){
    this.typingComment = true;
  }

  onBlur(){
    this.typingComment = false;
  }

}
