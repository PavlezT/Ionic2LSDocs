import { Component, ViewChild } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { Http, Headers, RequestOptions  } from '@angular/http';
import * as moment from 'moment';

import * as consts from '../../../utils/Consts';
import { User } from '../../../utils/user';

@Component({
  selector: 'TaskItem',
  templateUrl: 'TaskItem.html'
})
export class TaskItem {
  siteUrl : string;

  task : any;
  Title : string;
  Status : string;
  ContentType : string;
  startDate : string;
  deadLine : string;
  assignetTo : {Email : string, Title: string};
  taskAuthore : {Email : string, Title: string};

  @ViewChild('coments') coments ;

  constructor(public viewCtrl: ViewController, public navParams: NavParams, public http : Http, public user : User) {
    this.siteUrl = consts.siteUrl;
    this.task = navParams.data.item;
    this.Status = navParams.data.item.OData__Status || 'Done';
    this.ContentType =  navParams.data.item.TaskType ||  navParams.data.item.ContentType.Name;
    this.Title = navParams.data.item.Title || navParams.data.item.TaskTitle;
    this.startDate = navParams.data.item.StartDate;
    this.deadLine = navParams.data.item.TaskDueDate || navParams.data.item.DueDate;
    this.assignetTo = navParams.data.item.AssignetToEmail ? {Email: navParams.data.item.AssignetToEmail, Title: navParams.data.item.AssignetToTitle } : {Email: navParams.data.item.ExecutorEmail ,Title: navParams.data.item.NameExecutor};
    this.taskAuthore = navParams.data.item.TaskAuthore || {Email :navParams.data.item.AthoreEmail,Title : navParams.data.item.NameAuthore };
    console.log('this task',this.task);
  }

  ionViewDidLoad() {

   //  setTimeout(() => {
   //    this.myInput.setFocus();
   // },550);

  }

  dismiss(){
     this.viewCtrl.dismiss();
  }

  toworkTask(){
     console.log('to work');
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
     console.log('cancel work')
  }

  executeTask(){
     console.log('execute task');
  }

  writeToHistory() : Promise<any>{

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
              StartDate: StartDate, //Дата начала
              DueDate: DueDate, //Дата завершения
              EvanteDate: EvanteDate, //Дата события
              Comments: this.coments.value,
              ExecutorEmail: this.user.getEmail(),
              AthoreEmail: this.taskAuthore.Email,
              TaskID: this.task.Id
            }],
            HistoryType : 'HistoryDataForUser'
          };

          this.updateHistory(StateInRouteData);
          StateInRouteData.HistoryType = 'TaskAndDocHistory';
         return  this.updateHistory(StateInRouteData);
          
          //LSOnlineTaskData.LSDocsStartWriteToHistory();

  }

  updateHistory(routeData : any) : Promise <any> {
    let url = `${consts.siteUrl}/_api/Web/Lists/GetByTitle('LSDocsListTransitHistory')/Items`;

    let body = {
      "__metadata": {
          type: "SP.Data.LSDocsListTransitHistoryItem"
      },
      Title : routeData.HistoryTape,
      ListID : routeData.sysIDList,
      ItemID : routeData.sysIDItem,
      Type : routeData.EventTypeUser,
      historyData : JSON.stringify(routeData.HistoryArray),
      itemData : JSON.stringify(routeData.itemData)
    }
			// var Tenend = _spPageContextInfo.siteAbsoluteUrl.split('/');
			// appInsights.trackEvent("WriteHistoryEvent", { User: LSOnlineTaskData.CurentUserTitle, Tenand: Tenend[2] + '/' + Tenend[3] + '/' + Tenend[4], ListID: StateInRouteData.sysIDList, DocumentID: StateInRouteData.sysIDItem }, { HistoryWriteCount: 1 });
    
    // Authorization: "Bearer " + accessToken
    let headers = new Headers({'Accept': 'application/json;odata=verbose',"Content-Type": "application/json;odata=verbose"});
    let options = new RequestOptions({ headers: headers });

    return this.http.post(url,JSON.stringify(body),options).toPromise();
  }

  updateTaskData(id : number, data : any) : Promise<any> {
    let url = `${consts.siteUrl}/_api/Web/Lists/GetByTitle('LSTasks')/Items(${id})`;

    let headers = new Headers({'Accept': 'application/json;odata=verbose',"Content-Type": "application/json;odata=verbose","IF-MATCH": "*","X-Http-Method": "MERGE"});
    let options = new RequestOptions({ headers: headers });

    return this.http.post(url,JSON.stringify(data),options).toPromise();
  }

}
