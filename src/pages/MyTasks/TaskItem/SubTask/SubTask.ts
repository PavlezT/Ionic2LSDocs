import { Component, Inject, ViewChild } from '@angular/core';
import { Platform, ToastController, ViewController, NavParams, Events } from 'ionic-angular';
import { Http, Headers, RequestOptions  } from '@angular/http';
import { DatePicker } from '@ionic-native/date-picker';

import * as consts from '../../../../utils/consts';
import * as moment from 'moment';
import { User } from '../../../../utils/user';
import { Access } from '../../../../utils/access';
import { Loader } from '../../../../utils/loader';
import { Images } from '../../../../utils/images';
import { Localization } from '../../../../utils/localization';
import { ContentType } from '@angular/http/src/enums';

@Component({
  selector: 'subtask',
  templateUrl: 'SubTask.html'
})

export class SubTask {

   @ViewChild('subtaskname') subTaskName : any;

   access_token : string;
   digest : string;
   task : any;
   Title : string;
   contentType : string;
   taskAuthore : {EMail : string, Title: string};

   taskcreated : boolean;
   startsearch : boolean;
   selectedUser : any;
   selectedDate : any;
   Users : any;
   ShowUsers : any;

   updateTransitHistory : any;

  constructor(public platform: Platform, public viewCtrl: ViewController ,@Inject(Localization) public loc : Localization,
  @Inject(Loader) public loaderctrl: Loader,public events: Events,public toastCtrl: ToastController,@Inject(Access) public access: Access,
   public navParams: NavParams,@Inject(Http) public http : Http,@Inject(User) public user : User,  @Inject(Images) public images: Images,
   private datePicker: DatePicker )
   {
    this.task = navParams.data.task;
    this.Title = navParams.data.title;
    this.contentType = navParams.data.contentType;
    this.taskAuthore =  navParams.data.author;
    this.taskcreated = false;
    this.selectedUser = null;
    this.selectedDate = null;

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
    let data = { taskcreated : this.taskcreated, user : this.selectedUser, date : this.selectedDate, title : this.subTaskName.value.trim() };
    this.viewCtrl.dismiss(data);
  }

  public getUsers() : Promise<any> {
    let listGet = `${consts.siteUrl}/_api/Web/Lists/GetByTitle('LSUsers')/items?`
    +'$select=Id,IDDepartment,ol_Department,JobTitle,UserManager/Id,UserManager/Title,UserManager/EMail,User1/Id,User1/Title,User1/EMail,Deputy/Id,Deputy/Title,Deputy/EMail,DeputyId,AbsenceStart,AbsenceEnd'
    +'&$expand=UserManager,Deputy,User1';

    let headers = new Headers({'Accept': 'application/json;odata=verbose','Authorization':`Basic ${btoa(window.localStorage.getItem('username')+':'+window.localStorage.getItem('password'))}`});
    let options = new RequestOptions({ headers: headers });

    return this.http.get(listGet,options).timeout(consts.timeoutDelay).retry(consts.retryCount)
        .toPromise()
        .then( res => {
          this.Users = res.json().d.results;
        })
        .catch(error => {
          console.error('<TaskItem> Loading History error!',error);
          this.showToast(this.loc.dic.mobile.ErrorLoadingUsers);
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

  public createButtonClicked() : any {
    if(!this.selectedUser)
      return this.showToast(this.loc.dic.mobile.CheckUser);
    if( !(this.subTaskName.value && this.subTaskName.value.trim().length > 0) )
      return this.showToast(this.loc.dic.Alert22);
    if( !(this.selectedDate) )
      return this.showToast(this.loc.dic.mobile.DateNotFound);
    if( !(this.selectedDate >= (new Date((new Date(Date.now())).toDateString())) ))
      return this.showToast(this.loc.dic.Alert13);

    this.loaderctrl.presentLoading();
    this.taskcreated = true;

    this.selectedUser.assignTo = {
      Title : this.selectedUser.User1.Title,
      EMail : this.selectedUser.User1.EMail,
      Id : this.selectedUser.User1.Id
    }
    
    if ((this.selectedUser.AbsenceStart) || (this.selectedUser.AbsenceEnd)){
      var isDeputyUse = moment().isBetween(moment(this.selectedUser.AbsenceStart, 'DD.MM.YYYY'), moment(this.selectedUser.AbsenceEnd, 'DD.MM.YYYY'), 'day', '[]');
      if(isDeputyUse && this.selectedUser.Deputy && this.selectedUser.Deputy.EMail) {
        this.selectedUser.assignTo.Title = this.selectedUser.Deputy.Title;
        this.selectedUser.assignTo.EMail = this.selectedUser.Deputy.EMail;
        this.selectedUser.assignTo.Id = this.selectedUser.Deputy.Id;
      }
    }
  
     this.addSubTask()
      .then(()=>{
        this.dismiss();
        return this.loaderctrl.stopLoading();
      })
      .catch(error => {
        this.loaderctrl.stopLoading();
        this.taskcreated = false;
        this.showToast(this.loc.dic.mobile.OperationError);
      })
  }

  public addSubTask() : Promise<any> {
    var StateInRouteData = {
      '__metadata':{
        type : "SP.Data.LSTasksListItem"
      },
      sysIDItem: this.task.sysIDItem,
      sysIDList: this.task.sysIDList,
      sysIDMainTask : (this.contentType == 'LSTaskResolution' ? 0 : (this.task.sysIDMainTask == 0 ? this.task.Id : this.task.sysIDMainTask)).toString(),
      sysIDParentMainTask: (this.contentType == 'LSTaskResolution' ? 0 : (this.task.sysIDMainTask == 0 ? this.task.Id : this.task.sysIDMainTask)).toString(),
      Title: this.subTaskName.value.trim().replace(':', ' '),      
      StateID: this.task.StateID,
      sysTaskLevel: (parseInt(this.task.sysTaskLevel || '0') +1 ).toString(),
      TaskDescription: null,
      TaskDueDate: moment(this.selectedDate).format('YYYY-MM-DD[T]HH:mm:ss[Z]'),
      EstimatePlan: null,
      TaskAuthoreId: this.user.getId(),
      TaskAuthorEmail: this.user.getEmail(),
      AssignetToTitle: this.selectedUser.assignTo.Title,
      AssignetToEmail: this.selectedUser.assignTo.EMail,
      AssignedToId : this.selectedUser.assignTo.Id,
      AssignedManagerId : this.selectedUser.UserManager.Id,
      DepartmentOfUser : this.selectedUser.ol_Department,
      OData__Status : 'Not Started',
    };
    
    let itemData = {
      ItemId: this.task.sysIDItem,
      ListID: this.task.sysIDList,
      ItemTitle: "-", 
      ListTitle: "-", 
      EventType: 'Task'
    };
    
    var HistoryArray = [{
      EventType :  (this.contentType != 'LSTaskResolution' ? 'EventCreateTask EventAddTask' : 'EventCreateTask'),
      Event: this.loc.dic.Alert68,
      NameExecutor : this.selectedUser.assignTo.Title,
      NameAuthore : this.user.getUserName(),
      TaskTitle : this.subTaskName.value.trim(),
      StartDate :  moment().format("DD.MM.YYYY HH:mm:ss"),
      DueDate: this.selectedDate.toLocaleDateString(),
      EvanteDate: moment().format("YYYY-MM-DD HH:mm:ss"),
      Comments: '',
      ExecutorEmail: this.selectedUser.assignTo.EMail,
      AthoreEmail: this.user.getEmail(),
      ItemId: this.task.sysIDItem,
      ListID: this.task.sysIDList
    }];
    
    return this.getContentType((this.contentType == 'LSTaskResolution' ? 'LSResolutionTaskToDo' : 'LSSTaskAdd' ))
      .then((contentType) =>{
        StateInRouteData['ContentTypeId'] = contentType.Id.StringValue;
        return this.WriteTask(StateInRouteData);
      })
      .then((createdTask : any) => {
        HistoryArray[0]['TaskID'] = createdTask.json().d.Id;
        StateInRouteData['EventTypeUser'] = (this.contentType != 'LSTaskResolution' ? 'EventCreateTask EventAddTask' : 'EventCreateTask');
        StateInRouteData['HistoryType'] = 'HistoryDataForUser';
        StateInRouteData['itemData'] = itemData;
        StateInRouteData['HistoryArray'] = HistoryArray;
        return Promise.all([this.updateTransitHistory(StateInRouteData),this.updateTransitHistory(StateInRouteData,'TaskAndDocHistory')]);
      })
  }

  public getContentType(name) : Promise<any>{
    let listGet = `${consts.siteUrl}/_api/Web/Lists/GetByTitle('LSTasks')/ContentTypes?$select=Name,Id&$filter=(Name eq '${name}')`;

    let headers = new Headers({'Accept': 'application/json;odata=verbose','Authorization':`Basic ${btoa(window.localStorage.getItem('username')+':'+window.localStorage.getItem('password'))}`});
    let options = new RequestOptions({ headers: headers });

    return this.http.get(listGet,options).timeout(consts.timeoutDelay).retry(consts.retryCount)
        .toPromise()
        .then( res => {
          return res.json().d.results[0];
        })
        .catch(error => {
          throw new Error('Erorr getting contentType: '+name);
        })
  }

  public WriteTask(body) : Promise<any> {
    let url = `${consts.siteUrl}/_api/Web/Lists/GetByTitle('LSTasks')/Items`;

    let headers = new Headers({"Authorization":(window.localStorage.getItem('OnPremise')?`Basic ${btoa(window.localStorage.getItem('username')+':'+window.localStorage.getItem('password'))}`:`Bearer ${this.access_token}`),"X-RequestDigest": this.digest,'X-HTTP-Method':'POST','IF-MATCH': '*','Accept': 'application/json;odata=verbose',"Content-Type": "application/json;odata=verbose"});
    let options = new RequestOptions({ headers: headers });

    return this.http.post(url,JSON.stringify(body),options).timeout(consts.timeoutDelay).retry(consts.retryCount).toPromise();
  }

  public showDatePicker() : void {
    this.datePicker.show({
      date: new Date(Date.now()),
      mode: 'date',
      minDate : new Date(Date.now()).toString(),
      titleText : this.loc.dic.Alert21,
      androidTheme : this.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT
    }).then(
      date =>{ if(date)this.selectedDate = new Date(date); },
      err => { }
    );
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

}