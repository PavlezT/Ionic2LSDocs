import { Component, ViewChild, Inject  } from '@angular/core';
import { ViewController,ModalController,LoadingController,Platform, ToastController, NavController,NavParams, Events } from 'ionic-angular';
import { Http, Headers, RequestOptions  } from '@angular/http';
import * as moment from 'moment';

import { Item } from '../../Contracts/Item/Item';
import { History } from '../../Contracts/Item/Tabs/History/History';
import { Delegate } from './Delegate/Delegate';
import { SubTask } from './SubTask/SubTask';

import { ArraySortPipe } from '../../../utils/arraySort';
import * as consts from '../../../utils/consts';
import { User } from '../../../utils/user';
import { Access } from '../../../utils/access';
import { SelectedItem } from '../../../utils/selecteditem';
import { Loader } from '../../../utils/loader';
import { Images } from '../../../utils/images';
import { Localization } from '../../../utils/localization';

@Component({
  selector: 'TaskItem',
  providers: [ArraySortPipe],
  templateUrl: 'TaskItem.html'
})
export class TaskItem {
  siteUrl : string;
  loader : any;

  historyToggle : boolean = false;
  subtaskToggle : boolean = false;
  typingComment : boolean = false;
  history : any;
  taskHistory : any;
  connectedItem : any;
  SubTasks : Array<any>;
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
  delegatable : boolean;

  @ViewChild('comments') comments;
  @ViewChild('myFooter') footer;
  @ViewChild('middlelabel') middlelabel;
  scrollHeight : any;

  getTaskHistory = History.prototype.getHistory;

  constructor(public platform: Platform,public navCtrl: NavController,public modalCtrl: ModalController,
    @Inject(Images) public images: Images ,@Inject(Localization) public loc : Localization,@Inject(Loader) public loaderctrl: Loader,
    public events: Events, public viewCtrl: ViewController,public loadingCtrl: LoadingController,public toastCtrl: ToastController,
    @Inject(Access) public access: Access,@Inject(SelectedItem) public selectedItem : SelectedItem, public navParams: NavParams,
    @Inject(Http) public http : Http,@Inject(User) public user : User) 
    {
    this.siteUrl = consts.siteUrl;
    this.task = navParams.data.item;
    this.Status = navParams.data.item.OData__Status || 'Done';
    this.ContentType =  navParams.data.item.TaskType ||  navParams.data.item.ContentType.Name || "undefined";
    this.Title = navParams.data.item.Title || navParams.data.item.TaskTitle;
    this.startDate = navParams.data.item.StartDate_view;
    this.deadLine = navParams.data.item.TaskDueDate_view || navParams.data.item.DueDate_view;
    this.assignetTo = navParams.data.item.AssignetToEmail ? {Email: navParams.data.item.AssignetToEmail, Title: navParams.data.item.AssignetToTitle } : {Email: navParams.data.item.ExecutorEmail ,Title: navParams.data.item.NameExecutor};
    this.taskAuthore = navParams.data.item.TaskAuthore || {EMail :navParams.data.item.AthoreEmail,Title : navParams.data.item.NameAuthore };

    this.delegatable = this.Status != "Done" && this.task.sysTaskLevel == 1 && this.ContentType != 'LSTaskToRegistrate' && this.assignetTo.Email == this.user.getEmail() ? true : false;

    this.getConnectedDoc();
    this.getHistory()
      .then( history => this.getTaskHistory(history) )
      .catch(error => {
        console.log('<Get Connected doc and Hostory> error:',error);
        this.history = [];
      })
    this.getSubtasks();

    access.getDigestValue().then(digest => this.digest = digest);
    access.getToken().then(token => this.access_token = token);
  }

  ionViewDidLoad(){
    this.platform.registerBackButtonAction((e)=>{this.dismiss();return false;},100);
    this.recalcHistoryHeight();
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

  private recalcHistoryHeight() : void {
    if(this.footer)
      this.scrollHeight = this.footer.nativeElement.offsetTop-this.footer.nativeElement.offsetHeight-this.middlelabel.nativeElement.offsetTop-this.middlelabel.nativeElement.offsetHeight + "px";
    else 
      this.scrollHeight = this.middlelabel.nativeElement.offsetParent.offsetHeight-this.middlelabel.nativeElement.offsetTop-this.middlelabel.nativeElement.offsetHeight+"px";//-56
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
          this.showToast(this.loc.dic.mobile.OperationError);
          this.loaderctrl.stopLoading().then(()=>{this.dismiss();});
        })
  }

  public cancelTask() : void {
    if(this.comments.value.toString().trim().length > 0){
      this.loaderctrl.presentLoading();
      if(this.ContentType == 'LSTaskAppruve' || this.ContentType == 'LSTaskAgreement')
        this.doneTask('Back');
      if(this.ContentType == 'LSTaskPreparetion')
        this.doneTask('RefuseTask');
    } else {
      this.showToast(this.loc.dic.Alert14);
    }
  }

  public executeTask() : void {
     this.loaderctrl.presentLoading();

     if (this.ContentType == 'LSTaskResolution') {
      this.сheckResolution()
        .then( res => {
          if (res.json().d.results.length !== 0) {
              this.doneTask('Done');
          } else {
              this.showToast(this.loc.dic.Alert28);
              this.loaderctrl.stopLoading();
          }
        })
        .catch(error=>{
          console.log('<TaskItem> checkResolution error:',error)
          this.showToast(this.loc.dic.Alert28);
          this.loaderctrl.stopLoading();
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
        OData__Comments : this.comments.value.toString().trim(),
        TaskResults : taskResult
      }
      this.task.TaskResults = taskResult;
      
      Promise.all([this.updateTaskData(this.task.Id,data)])
        .then(()=>{
          return this.writeToHistoryAfterTaskDone();
        })
        .then( ()=>{
          console.log('<TaskItem> done Task')
          this.events.publish('task:checked');
          this.events.publish('task:doneTask',this.task);
          this.loaderctrl.stopLoading().then(()=>{this.dismiss();});
        })
        .catch(err=>{
          console.log('<TaskItem> doneTask error',err);
          this.showToast(this.loc.dic.mobile.OperationError);
          this.loaderctrl.stopLoading().then(()=>{this.dismiss();});
        })
  }

  private writeToHistoryAfterTaskDone() : Promise<any> {
        let EvanteDate = moment().format("YYYY-MM-DD HH:mm:ss");
        let StartDate = moment.utc(this.task.startDate).format("DD.MM.YYYY HH:mm:ss");
        let DueDate = moment.utc(this.task.TaskDueDate).format("DD.MM.YYYY")

        let taskEvent = this.loc.dic.Alert60;
        let EventType = 'EventDoneTask';

        if (this.ContentType == 'LSTaskAppruve') {
            if (this.task.TaskResults == 'Back') {
              taskEvent = this.loc.dic.Alert66;
              EventType = 'EventBackTask';
            } else {
              taskEvent = this.loc.dic.Alert62;
            }
        }
        if (this.ContentType == 'LSSTaskAdd') {
            EventType = 'EventDoneTask EventAddTask';
        }
        if (this.task.TaskResults == 'Delegate') {
            taskEvent = this.user.getUserName()+" "+this.loc.dic.Alert67;
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
            Event: taskEvent,
            NameExecutor: this.user.getUserName(),
            NameAuthore: this.taskAuthore.Title,
            TaskTitle: this.Title,
            StartDate: StartDate,
            DueDate: DueDate,
            StartDateSort: moment.utc(this.task.StartDate).format("YYYYMMDD"),
            DueDateSort: moment.utc(this.task.TaskDueDate).format("YYYYMMDD"),
            EvanteDate: EvanteDate,
            Comments: this.comments.value.toString().trim(),
            TaskType: this.ContentType,//this.task.TaskType,
            TaskResult: this.task.TaskResults,
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
            Action: 'TaskDone',
            ListID: this.task.sysIDList,
            ItemID: this.task.sysIDItem,
            Type: 'Task',
            DataSource: {
              TaskResults: this.task.TaskResults,
              CurentTaskID: this.task.Id,
              RelateListId: this.task.sysIDList,
              RelateItem: this.task.sysIDItem,
              Alert58: this.loc.dic.Alert58,
              StateID: this.task.StateID
            }
         }
         
        return Promise.all([this.updateTransitTask(transitTaskData),this.updateTransitHistory(StateInRouteData),this.updateTransitHistory(StateInRouteData,'TaskAndDocHistory')])
          .then(()=>{
           // return this.startWriteToHistory();
          })
          .catch(err=>{
              console.log('<TaskItem> writeToHistoryAfterTaskDone error',err);
              throw new Error('writeToHistoryAfterTaskDone error');
          })
  }

  private writeToHistoryAfterTaskGet() : Promise<any> {
          let EvanteDate = moment.utc().format("YYYY-MM-DD HH:mm:ss");//2017-06-01 04:32:35
          let StartDate = moment.utc(this.task.StartDate).format("DD.MM.YYYY HH:mm:ss");
          let DueDate = moment.utc(this.task.TaskDueDate).format("DD.MM.YYYY");

          let StateInRouteData = {
            sysIDList : this.task.sysIDList,
            sysIDItem : this.task.sysIDItem,
            EventTypeUser : 'TaskInWork',
            itemData : {
              ItemId: this.task.sysIDItem,
              ListID: this.task.sysIDList,
              ItemTitle: "-",
              ListTitle: "-",
              EventType: 'Task'
            },
            HistoryArray : [{
              EventType: 'EventInWorkTask',
              Event: this.loc.dic.Alert59,//"Task in progress",
              NameExecutor: this.user.getUserName(),
              NameAuthore: this.taskAuthore.Title,
              TaskTitle: this.Title,
              StartDate: StartDate,
              DueDate: DueDate,
              EvanteDate: EvanteDate,//2017-06-01 04:32:35
              Comments: this.comments.value.toString().trim(),
              ExecutorEmail: this.user.getEmail(),
              AthoreEmail: this.taskAuthore.EMail,
              TaskID: this.task.Id
            }],
            HistoryType : 'HistoryDataForUser'
          };
          
         return Promise.all([this.updateTransitHistory(StateInRouteData),this.updateTransitHistory(StateInRouteData,'TaskAndDocHistory')])
            .then(()=>{
              //return this.startWriteToHistory("WriteHistory");
            })
            .catch(err=>{
              console.log('<TaskItem> writeToHistory error',err);
              throw new Error('writeToHistory error');
            })
  }

  private сheckResolution() : Promise<any>{
      let url =  `${consts.siteUrl}/_api/Web/Lists/GetByTitle('LSTasks')/items?$select=sysIDItem,ID,sysIDList,ContentTypeId,Title,TaskDescription,StartDate,sysTaskLevel,TaskResults,sysIDParentMainTask,TaskDueDate,TaskAuthore/Title,TaskAuthore/EMail,AssignedToId,AssignedTo/Title,AssignedTo/EMail&$expand=TaskAuthore,AssignedTo,ContentType&$filter=(sysIDItem eq '${this.task.sysIDItem}') and (sysIDList eq '${this.task.sysIDList}') and (ContentType eq 'LSResolutionTaskToDo') and (TaskAuthore/Title eq '${encodeURI(this.taskAuthore.Title)}')`;

      let headers = new Headers({'Accept': 'application/json;odata=verbose','Authorization':`Basic ${btoa(window.localStorage.getItem('username')+':'+window.localStorage.getItem('password'))}`});
      let options = new RequestOptions({ headers: headers });

      return this.http.get(url,options).timeout(consts.timeoutDelay).retry(consts.retryCount).toPromise();
  }

  private updateTransitTask(taskData) : Promise<any> {
    taskData.DataSource.UserLang = 'LS'+ this.user.locale.toUpperCase();
    taskData.DataSource.Alert57 = this.loc.dic.Alert57;
    taskData.DataSource.Alert58 = this.loc.dic.Alert58;
    taskData.DataSource.Alert60 = this.loc.dic.Alert60;
    taskData.DataSource.Alert62 = this.loc.dic.Alert62;
    taskData.DataSource.Alert66 = this.loc.dic.Alert66;

    let body = {
      '__metadata': {
        type: "SP.Data.LSDocsListTransitTasksItem"
      },
      Title :  taskData.Action,
      ListID : taskData.ListID,
      ItemID: taskData.ItemID,
      Type: taskData.Type,
      DataSource : JSON.stringify(taskData.DataSource)
    }
    
    let url = `${consts.siteUrl}/_api/Web/Lists/GetByTitle('LSDocsListTransitTasks')/Items`;

    let headers = new Headers({"Authorization":(window.localStorage.getItem('OnPremise')?`Basic ${btoa(window.localStorage.getItem('username')+':'+window.localStorage.getItem('password'))}` : `Bearer ${this.access_token}`),"X-RequestDigest": this.digest,'X-HTTP-Method':'POST','IF-MATCH': '*','Accept': 'application/json;odata=verbose',"Content-Type": "application/json;odata=verbose"});
    let options = new RequestOptions({ headers: headers });

    return this.http.post(url,JSON.stringify(body),options).timeout(consts.timeoutDelay).retry(consts.retryCount).toPromise();
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
    
    let headers = new Headers({"Authorization":(window.localStorage.getItem('OnPremise')?`Basic ${btoa(window.localStorage.getItem('username')+':'+window.localStorage.getItem('password'))}`:`Bearer ${this.access_token}`),"X-RequestDigest": this.digest,'X-HTTP-Method':'POST','IF-MATCH': '*','Accept': 'application/json;odata=verbose',"Content-Type": "application/json;odata=verbose"});
    let options = new RequestOptions({ headers: headers });

    return this.http.post(url,JSON.stringify(body),options).timeout(consts.timeoutDelay).retry(consts.retryCount).toPromise();
  }

  private updateTaskData(id : number, data : any) : Promise<any> {
    let url = `${consts.siteUrl}/_api/Web/Lists/GetByTitle('LSTasks')/Items(${id})`;

    let headers = new Headers({"Authorization":(window.localStorage.getItem('OnPremise')?`Basic ${btoa(window.localStorage.getItem('username')+':'+window.localStorage.getItem('password'))}`:`Bearer ${this.access_token}`),"X-RequestDigest": this.digest,'X-HTTP-Method':'MERGE','IF-MATCH': '*','Accept': 'application/json;odata=verbose',"Content-Type": "application/json;odata=verbose"});
    let options = new RequestOptions({ headers: headers });

    return this.http.post(url,JSON.stringify(data),options).timeout(consts.timeoutDelay).retry(consts.retryCount).toPromise();
  }

  private getConnectedDoc() : Promise<any> {
     let listGet = `${consts.siteUrl}/_api/Web/Lists(guid'${this.task.sysIDList || this.task.ListID}')/items(${this.task.sysIDItem || this.task.ItemId})`;

     let headers = new Headers({'Accept': 'application/json;odata=verbose','Authorization':`Basic ${btoa(window.localStorage.getItem('username')+':'+window.localStorage.getItem('password'))}`});
     let options = new RequestOptions({ headers: headers });

     return this.http.get(listGet,options).timeout(consts.timeoutDelay).retry(consts.retryCount)
         .toPromise()
         .then(res =>{
            this.connectedItem = res.json().d;
         })
         .catch(error => {
            console.log('There is no connected doc',error);
         })
  }

  private getHistory() : Promise<any> {
    let listGet = `${consts.siteUrl}/_api/Web/Lists/GetByTitle('LSHistory')/items?$filter=(ItemId eq '${this.task.sysIDItem || this.task.ItemId}') and (Title eq '${this.task.sysIDList || this.task.ListID}') and (ItemName eq 'Task')`;

    let headers = new Headers({'Accept': 'application/json;odata=verbose','Authorization':`Basic ${btoa(window.localStorage.getItem('username')+':'+window.localStorage.getItem('password'))}`});
    let options = new RequestOptions({ headers: headers });

    return this.http.get(listGet,options).timeout(consts.timeoutDelay).retry(consts.retryCount)
        .toPromise()
        .then( res => {
          return res.json().d.results || [];
        })
        .catch(error => {
          console.error('<TaskItem> Loading History error!',error);
          return [];
        })
  }

  private getSubtasks() : Promise<any> {
    let listGet = `${consts.siteUrl}/_api/Web/Lists/GetByTitle('LSTasks')/items?`
      +`$select=sysIDItem,ID,sysIDList,Title,StartDate,sysTaskLevel,TaskResults,sysIDMainTask,sysIDParentMainTask,`
      +`TaskDueDate,OData__Status,TaskAuthore/Title,TaskAuthore/EMail,AssignedToId,AssignedTo/Title,AssignedTo/EMail`
      +`&$expand=TaskAuthore/Title,TaskAuthore/EMail,AssignedTo/Title,AssignedTo/EMail`
      +`&$filter=(sysIDMainTask eq '${this.task.Id}') and (sysTaskLevel eq '2')`;

    let headers = new Headers({'Accept': 'application/json;odata=verbose','Authorization':`Basic ${btoa(window.localStorage.getItem('username')+':'+window.localStorage.getItem('password'))}`});
    let options = new RequestOptions({ headers: headers });

    return this.http.get(listGet,options).timeout(consts.timeoutDelay).retry(consts.retryCount)
        .toPromise()
        .then( res => {
          this.SubTasks = res.json().d.results.map(item=>{
            item.DueDate_view = moment.utc(item.TaskDueDate).format("dd, DD MMMM");
            return item;
          }) || [];
        })
        .catch(error => {
          console.error('<TaskItem> Loading History error!',error);
          this.SubTasks = [];
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
    this.subtaskToggle = false;
    if(this.historyToggle){
      this.historyToggle = false;
      return;
    }
    this.historyToggle = true;

    this.recalcHistoryHeight();
  }

  public showTasks() : void {
    this.historyToggle = false;
    if(this.subtaskToggle){
      this.subtaskToggle = false;
      return;
    }
    this.subtaskToggle = true;
  }

  public openConnecedItem() : void {
     this.selectedItem.set(this.connectedItem, this.task.sysIDList || this.task.ListID);
     this.navCtrl.push(Item, {
      item: this.connectedItem,
      listGUID : this.task.sysIDList || this.task.ListID
     });
  }

  public delegateOpen() : void {
    let modal = this.modalCtrl.create(Delegate,{
      item : this.task,
      title : this.Title,
      contentType : this.ContentType,
      author : this.taskAuthore,
      updateTransitHistory : this.updateTransitHistory
    },{
      showBackdrop : true
    });
    modal.present();

    modal.onDidDismiss(data => {
      if(data.delegated){
        this.events.publish('task:checked');
        this.events.publish('task:doneTask',this.task);
        this.dismiss();
      }
    });
  }

  public openSubTask() : void {
    let modal = this.modalCtrl.create(SubTask,{
      task : this.task,
      title : this.Title,
      contentType : this.ContentType,
      author : this.taskAuthore,
      updateTransitHistory : this.updateTransitHistory
    },{
      showBackdrop : true
    });
    modal.present();

    modal.onDidDismiss(data => {
      if(data.taskcreated){
        this.SubTasks.push({
          AssignedTo :  data.user.assignTo,
          TaskAuthore : {
            EMail : this.user.getEmail(),
            Title : this.user.getUserName()
          },
          Title : data.title,
          DueDate_view : moment(data.date).format("dd, DD MMMM")
        });
      }
    });
  }

  onFocus(){
    this.typingComment = true;
  }

  onBlur(){
    this.typingComment = false;
  }

  // private startWriteToHistory(nameReciver? : string) : Promise<any> {
  //    let listGet = `${consts.siteUrl}/_api/Web/Lists/GetByTitle('LSMainTransit')/items?$select=Id,Title,DataSource${nameReciver? "&$filter=Title eq '"+nameReciver+"'" : ""}`;

  //    let headers = new Headers({'Accept': 'application/json;odata=verbose','Authorization':`Basic ${btoa(window.localStorage.getItem('username')+':'+window.localStorage.getItem('password'))}`});
  //    let options = new RequestOptions({ headers: headers });

  //    return this.http.get(listGet,options).timeout(consts.timeoutDelay).retry(consts.retryCount).toPromise()
  //        .then( res =>{
  //          return res.json().d.results.map(item => {
  //              if(item.DataSource != 'true'){
  //                 let url = `${consts.siteUrl}/_api/Web/Lists/GetByTitle('LSMainTransit')/items(${item.Id})`;
  //                 let body = {
  //                    __metadata : {
  //                       type : 'SP.Data.LSMainTransitItem'
  //                    },
  //                    DataSource : 'true'
  //                 }
  //                 let headers = new Headers({"Authorization":(window.localStorage.getItem('OnPremise')? `Basic ${btoa(window.localStorage.getItem('username')+':'+window.localStorage.getItem('password'))}` : `Bearer ${this.access_token}`),"X-RequestDigest":this.digest, "X-HTTP-Method":"MERGE","IF-MATCH": "*",'Accept': 'application/json;odata=verbose',"Content-Type": "application/json;odata=verbose"});
  //                 let options = new RequestOptions({ headers: headers });
  //                 return this.http.post(url,JSON.stringify(body),options).timeout(consts.timeoutDelay).retry(consts.retryCount).toPromise().catch(err=>{console.log('post maint trasit error',err)});
  //              }
  //           })
  //        })
  //        .catch(err=>{
  //          console.log(`<TaskItem> Error startWtriteToHistory 'LSMainTransit'`,err);
  //          throw new Error('startWriteToHistory error');
  //        })
  // }

}
