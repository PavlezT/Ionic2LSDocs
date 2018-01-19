import { Component, Inject } from '@angular/core';
import { Platform, ToastController, ViewController, NavParams, Events } from 'ionic-angular';
import { Http, Headers, RequestOptions  } from '@angular/http';

import * as consts from '../../../../utils/consts';
import * as moment from 'moment';
import { User } from '../../../../utils/user';
import { Access } from '../../../../utils/access';
import { Loader } from '../../../../utils/loader';
import { Images } from '../../../../utils/images';
import { Localization } from '../../../../utils/localization';

@Component({
  selector: 'delegate',
  templateUrl: 'Delegate.html'
})

export class Delegate {

   access_token : string;
   digest : string;
   task : any;
   Title : string;
   contentType : string;
   taskAuthore : {EMail : string, Title: string};

   delegated : boolean;
   startsearch : boolean;
   selectedUser : any;
   Users : any;
   ShowUsers : any;

   updateTransitHistory : any;

  constructor(public platform: Platform, public viewCtrl: ViewController ,@Inject(Localization) public loc : Localization,
  @Inject(Loader) public loaderctrl: Loader,public events: Events,public toastCtrl: ToastController,@Inject(Access) public access: Access,
   public navParams: NavParams,@Inject(Http) public http : Http,@Inject(User) public user : User,  @Inject(Images) public images: Images )
   {
    this.task = navParams.data.task;
    this.Title = navParams.data.title;
    this.contentType = navParams.data.contentType;
    this.taskAuthore =  navParams.data.author;
    this.delegated = false;
    this.selectedUser = null;

    this.updateTransitHistory = navParams.data.updateTransitHistory;

    access.getDigestValue().then(digest => this.digest = digest);
    access.getToken().then(token => this.access_token = token);

    this.loaderctrl.presentLoading();
    this.getUsers().then(()=>{
      this.loaderctrl.stopLoading();
    })
  }

  ionViewDidEnter(){
    this.platform.registerBackButtonAction((e)=>{this.dismiss();return false;},100);
  }

  dismiss() {
    let data = { delegated : this.delegated, user : this.selectedUser };
    this.viewCtrl.dismiss(data);
  }

  public getUsers() : Promise<any> {
    let listGet = `${consts.siteUrl}/_api/Web/Lists/GetByTitle('LSUsers')/items?`
    +'$select=ID,IDDepartment,ol_Department,JobTitle,UserManager/Title,UserManager/EMail,User1/Title,User1/EMail,Deputy/Title,Deputy/EMail,DeputyId,AbsenceStart,AbsenceEnd'
    +'&$expand=UserManager,Deputy,User1';

    let headers = new Headers({'Accept': 'application/json;odata=verbose','Authorization':`Basic ${btoa(window.localStorage.getItem('username')+':'+window.localStorage.getItem('password'))}`});
    let options = new RequestOptions({ headers: headers });

    return this.http.get(listGet,options).timeout(consts.timeoutDelay).retry(consts.retryCount)
        .toPromise()
        .then( res => {
          this.Users = res.json().d.results;
          // for(var i = 0; i < 12 ; i++){
          //   this.Users.push(this.Users[1]);
          // }
        })
        .catch(error => {
          console.error('<TaskItem> Loading History error!',error);
          return [];
        })
  }

  public searchUser(event) : void {
    let str = event.target.value;
    this.selectedUser = null;

    if(str && str.length >= 3){
      this.startsearch = true;
      this.ShowUsers = this.Users.filter(user => {
        if(user.User1.EMail.toString().toLowerCase().includes(str.toLowerCase()) || user.User1.Title.toString().toLowerCase().includes(str.toLowerCase()))
          return user;
        return false;
      })
    } else {
      this.startsearch = false;
    }

  }

  public userSelected(user) : void {
    this.selectedUser = user;
  }

  public delegateButtonClicked() : void {
    if(!this.selectedUser)
      return this.showToast(this.loc.dic.mobile.CheckUser);
    if( this.selectedUser.User1.EMail == this.user.getEmail())
      return this.showToast(this.loc.dic.Alert98);

    this.loaderctrl.presentLoading();
    this.delegated = true;

    this.selectedUser.assignTo = {
      title : this.selectedUser.User1.Title,
      email : this.selectedUser.User1.EMail
    }

    if ((this.selectedUser.AbsenceStart) || (this.selectedUser.AbsenceEnd)){
      var isDeputyUse = moment().isBetween(moment(this.selectedUser.AbsenceStart, 'DD.MM.YYYY'), moment(this.selectedUser.AbsenceEnd, 'DD.MM.YYYY'), 'day', '[]');
      if(isDeputyUse) {
        this.selectedUser.assignTo.title = this.selectedUser.Deputy.Title;
        this.selectedUser.assignTo.email = this.selectedUser.Deputy.EMail;
      }
    }

    this.DelegateTask()
      .then(()=>{
        return this.loaderctrl.stopLoading()
      })
      .then(()=>{
        this.dismiss();
      })
      .catch(error => {
        this.loaderctrl.stopLoading();
        this.delegated = false;
        this.showToast(this.loc.dic.mobile.OperationError);
      })
  }

  public DelegateTask() : Promise<any> {
     var RouteForCreate = [];
     var EstimatePOST = moment(this.task.TaskDueDate).format('L');
     var DueDate = EstimatePOST.split('/');
     
     var StateInRouteData = [{
        ContentTypeId: this.task.ContentTypeId,
        sysIDItem: this.task.sysIDItem,
        sysIDList: this.task.sysIDList,
        sysIDMainTask: 0,
        Title: this.task.Title,
        sysIDParentMainTask: 0,
        StateID: this.task.StateID,
        sysTaskLevel: 1,
        TaskDescription: '',
        TaskDueDate: EstimatePOST,
        EstimatePlan: this.task.EstimatePlan == 'null'? 0 : this.task.EstimatePlan,
        TaskAuthore: this.user.getUserName() ,
        AssignetToTitle: this.selectedUser.assignTo.title,
        AssignetToEmail: this.selectedUser.assignTo.email,
        MainTaskStatus: this.task.OData__Status,
        OData__Status : 'Not Started',
        MainTaskID: this.task.ID,
        Delegate: 'Delegate',
        TaskAuthorEmail: this.user.getEmail(),
        CommitteeId: this.task.CommitteeId,
        AssignetToManager : this.selectedUser.UserManager.Title,
				AssignetToManagerEMail : this.selectedUser.UserManager.EMail,
        DepartmentOfUser : this.selectedUser.ol_Department,
        ActionTime : moment().toString(),
        DueDate : DueDate[1] + '.' + DueDate[0] + '.' + DueDate[2],
        Event : this.contentType == 'LSSTaskAdd' ? this.loc.dic.Alert68 :  this.loc.dic.Alert57,
        EventTypeUser : this.contentType == 'LSSTaskAdd' ?  'EventCreateTask EventAddTask' : 'EventCreateTask',
     }];

            var TaskAuthoreTitle = SP.FieldUserValue.fromUser(StateInRouteData[count].TaskAuthorEmail);
            oListItem.set_item('TaskAuthore', TaskAuthoreTitle);

					 var AssignedTo = SP.FieldUserValue.fromUser(StateInRouteData[count].AssignetToEmail);
           oListItem.set_item('AssignedTo', AssignedTo);
           
					 if (!!StateInRouteData[count].AssignetToManager) {
						  var AssignedManager = SP.FieldUserValue.fromUser(StateInRouteData[count].AssignetToManagerEMail);
						  oListItem.set_item('AssignedManager', AssignedManager);
					 }

           StateInRouteData[count].EventTypeDoc = 'Task';
					 StateInRouteData[count].itemData = {
						  ItemId: StateInRouteData[count].sysIDItem, //ИД связанного документта
						  ListID: StateInRouteData[count].sysIDList, //ИД списка связанного документта
						  ItemTitle: "-", //Название связанного документта
						  ListTitle: "-", //Название списка связанного документта
						  EventType: 'Task'
					 };
					 StateInRouteData[count].HistoryArray = [{
						  EventType: StateInRouteData[count].EventTypeUser,
						  Event: StateInRouteData[count].Event, //+ FindeStateType(Task[0]), //Тип действия
						  NameExecutor: StateInRouteData[count].AssignetToTitle, //Имя исполнитель
						  NameAuthore: StateInRouteData[count].TaskAuthore, //Имя автора
						  TaskTitle: StateInRouteData[count].Title, //Заголовок задачи
						  StartDate: StateInRouteData[count].ActionTime.format("DD.MM.YYYY HH:mm:ss"), //Дата начала
						  DueDate: StateInRouteData[count].DueDate, //Дата завершения
						  EvanteDate: StateInRouteData[count].ActionTime.format("YYYY-MM-DD HH:mm:ss"), //Дата события
						  Comments: '',
						  TaskID: StateInRouteData[count].TaskID,
						  ExecutorEmail: StateInRouteData[count].AssignetToEmail,
						  AthoreEmail: StateInRouteData[count].TaskAuthorEmail,
						  ItemId: StateInRouteData[count].sysIDItem,
						  ListID: StateInRouteData[count].sysIDList
					 }];
           StateInRouteData[count].HistoryType = 'HistoryDataForUser'
    
		if (this.contentType == 'LSResolutionTaskToDo') {
						  LSOnlineTaskData.LSGetResolutionTask(StateInRouteData[count].sysIDItem, StateInRouteData[count].sysIDList, LSOnlineTaskData.CurentUserEmail, StateInRouteData[count].MainTaskID, StateInRouteData[count].MainTaskStatus, LSOnlineTaskData.CurentUserTitle, StateInRouteData[count].StateID);
		}
						  var DataTransfer = {
								MainTaskID: StateInRouteData[count].MainTaskID,
								Delegate: StateInRouteData[count].Delegate,
								CurentUserEmail: LSOnlineTaskData.CurentUserEmai,
								CurentUserEmail: LSOnlineTaskData.CurentUserEmail,
								// TypeAction: StateInRouteData.TypeAction,
								sysIDItem: StateInRouteData[count].sysIDItem,
								sysIDList: StateInRouteData[count].sysIDList,
								NewTaskID: StateInRouteData[count].TaskID,
								StateID: StateInRouteData[count].StateID,
								AssignetToEmail: StateInRouteData[count].AssignetToEmail
						  };
						  
						  LSOnlineTaskData.LSRelinkTasksEventAdd(DataTransfer);


    return this.WriteTask(StateInRouteData)
      .then(() => {
        return Promise.all([this.updateTransitHistory(StateInRouteData),this.updateTransitHistory(StateInRouteData,'TaskAndDocHistory')]);
      })
      .then(()=>{
        //SEND TO TaskItem to Done Task // this.doneTask('Done');
      })
  }

  public WriteTask(body) : Promise<any> {
    let url = `${consts.siteUrl}/_api/Web/Lists/GetByTitle('LSTasks')/Items`;

    let headers = new Headers({"Authorization":(window.localStorage.getItem('OnPremise')?`Basic ${btoa(window.localStorage.getItem('username')+':'+window.localStorage.getItem('password'))}`:`Bearer ${this.access_token}`),"X-RequestDigest": this.digest,'X-HTTP-Method':'POST','IF-MATCH': '*','Accept': 'application/json;odata=verbose',"Content-Type": "application/json;odata=verbose"});
    let options = new RequestOptions({ headers: headers });

    return this.http.post(url,JSON.stringify(body),options).timeout(consts.timeoutDelay).retry(consts.retryCount).toPromise();
  }

  // public WriteToHistory(StateInRouteData,HistoryType?) {
  //   if(HistoryType)
  //     StateInRouteData.HistoryType = HistoryType;
    
  //   oListItem.set_item('Title', StateInRouteData.HistoryType);
  //   oListItem.set_item('ListID', StateInRouteData.sysIDList);
  //   oListItem.set_item('ItemID', StateInRouteData.sysIDItem);
  //   oListItem.set_item('Type', StateInRouteData.EventTypeUser);
  //   oListItem.set_item('historyData', JSON.stringify(StateInRouteData.HistoryArray));
  //   oListItem.set_item('itemData', JSON.stringify(StateInRouteData.itemData));
    
  //   let url = `${consts.siteUrl}/_api/Web/Lists/GetByTitle('LSDocsListTransitHistory')/Items`;
    
  //   let headers = new Headers({"Authorization":(window.localStorage.getItem('OnPremise')?`Basic ${btoa(window.localStorage.getItem('username')+':'+window.localStorage.getItem('password'))}`:`Bearer ${this.access_token}`),"X-RequestDigest": this.digest,'X-HTTP-Method':'POST','IF-MATCH': '*','Accept': 'application/json;odata=verbose',"Content-Type": "application/json;odata=verbose"});
  //   let options = new RequestOptions({ headers: headers });

  //   return this.http.post(url,JSON.stringify(StateInRouteData),options).timeout(consts.timeoutDelay).retry(consts.retryCount).toPromise();
  // }

  public showToast(message: any) : void {
    let toast = this.toastCtrl.create({
      message: (typeof message == 'string' )? message : message.toString().substring(0,( message.toString().indexOf('&#x') || message.toString().length)) ,
      position: 'bottom',
      showCloseButton : true,
      duration: 9000
    });
    toast.present();
  }

}