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
   Users : any;

  constructor(public platform: Platform, public viewCtrl: ViewController ,@Inject(Localization) public loc : Localization,
  @Inject(Loader) public loaderctrl: Loader,public events: Events,public toastCtrl: ToastController,@Inject(Access) public access: Access,
   public navParams: NavParams,@Inject(Http) public http : Http,@Inject(User) public user : User,  @Inject(Images) public images: Images )
   {
    this.task = navParams.data.task;
    this.Title = navParams.data.title;
    this.taskAuthore =  navParams.data.author;
    this.delegated = false;

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
    let data = { delegated : this.delegated };
    this.viewCtrl.dismiss(data);
  }

  public getUsers() : Promise<any> {
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

  public delegateButtonClicked() : void {
    this.loaderctrl.presentLoading();
    this.delegated = true;
    console.log('delegate');

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