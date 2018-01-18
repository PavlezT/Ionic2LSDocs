import { Component, Inject } from '@angular/core';
import { Platform, ToastController, ViewController, NavParams, Events } from 'ionic-angular';
import { Http, Headers, RequestOptions  } from '@angular/http';

import * as consts from '../../../../utils/consts';
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
   taskAuthore : {EMail : string, Title: string};

   delegated : boolean;
   startsearch : boolean;
   selectedUser : Object;
   Users : any;
   ShowUsers : any;

  constructor(public platform: Platform, public viewCtrl: ViewController ,@Inject(Localization) public loc : Localization,
  @Inject(Loader) public loaderctrl: Loader,public events: Events,public toastCtrl: ToastController,@Inject(Access) public access: Access,
   public navParams: NavParams,@Inject(Http) public http : Http,@Inject(User) public user : User,  @Inject(Images) public images: Images )
   {
    this.task = navParams.data.task;
    this.Title = navParams.data.title;
    this.taskAuthore =  navParams.data.author;
    this.delegated = false;
    this.selectedUser = null;

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
    +'$select=ID,IDDepartment,JobTitle,UserManager/Title,User1/Title,User1/EMail,Deputy/Title,Deputy/EMail,DeputyId,AbsenceStart,AbsenceEnd'
    +'&$expand=UserManager/Title,User1/Title,Deputy/Title,User1/EMail';

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

    this.loaderctrl.presentLoading();
    this.delegated = true;

    this.loaderctrl.stopLoading().then(()=>{this.dismiss();});
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