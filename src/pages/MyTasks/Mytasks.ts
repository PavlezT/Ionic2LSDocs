import { Component, Inject } from '@angular/core';
import { NavController,NavParams,Events, Platform } from 'ionic-angular';
import { Http, Headers, RequestOptions  } from '@angular/http';

import { User } from '../../utils/user';
import { Loader } from '../../utils/loader';
import * as consts from '../../utils/Consts';

import { LSNew } from './Tabs/LSNew/LSNew';
import { LSActive } from './Tabs/LSActive/LSActive';
import { LSLate } from './Tabs/LSLate/LSLate';
import { LSEnded } from './Tabs/LSEnded/LSEnded';

@Component({
  selector: 'MyTasks',
  templateUrl: 'MyTasks.html'
})
export class MyTasks {
   tabNew : any;
   tabActive : any;
   tabLate : any;
   tabEnded : any;

   counts : any;

   Title: string;
   chatParams : any;

  constructor(public navCtrl: NavController,public platform : Platform, public navParams: NavParams, @Inject(Loader) public loaderctrl: Loader,@Inject(Http) public http : Http, public events: Events, @Inject(User) public user : User) {
     this.Title = navParams.data.title || "Мої завдання";
     this.tabNew =  LSNew;
     this.tabActive = LSActive;
     this.tabLate = LSLate;
     this.tabEnded = LSEnded;
     this.resetCounts();

      platform.ready().then(()=>{
        events.subscribe('user:loaded',()=>{
            this.resetCounts();
            this.setTasksCount()
        });
        events.subscribe('task:checked',()=>{
            this.resetCounts();
            this.setTasksCount()
        });
        this.setTasksCount();
      })

      this.chatParams = {'d':'bb'};
  }

  ionViewDidEnter(){
    this.platform.registerBackButtonAction((e)=>{this.platform.exitApp();return false;},100);
  }

  setTasksCount() : Promise<any> {
    this.loaderctrl.presentLoading();
     return this.user.getUserProps()
      .then( (status) => {
         if(status)
            return this.getTasksCount();
         return [[],[]];
      })
      .then( (res) => {
         res[1].map((item) => {
            if(item.OData__Status == 'Not Started')
               this.counts.new++;
            if(item.OData__Status == 'In Progress')
               this.counts.active++;
            if(item.OData__Status != 'Done' && (new Date(item.TaskDueDate)) < (new Date((new Date()).getFullYear(),(new Date()).getMonth(),(new Date()).getDate())) )
               this.counts.late++;
         })

         res[0].map( item =>{
            if(item.CountTasks)
               this.counts.done += item.CountTasks;
         })
      })
      .then(()=>this.loaderctrl.stopLoading())
      .catch( error => {
         console.log('<MyTasks> setting Count Tasks error',error);
         this.loaderctrl.stopLoading();
         this.counts = {};
      })
  }

  getTasksCount() : Promise<any> {
     let getUrl = `${consts.siteUrl}/_api/Web/Lists/GetByTitle('LSTasks')/items?$select=AssignetToEmail,TaskDueDate,OData__Status&$filter=(AssignetToEmail eq '${this.user.getEmail()}')&$top=1000`;
     let listGet = `${consts.siteUrl}/_api/Web/Lists/GetByTitle('LSUsersHistory')/items?$select=UserName/EMail,CountTasks&$expand=UserName/EMail&$filter=UserName/EMail eq '${this.user.getEmail()}'&$top=1000`;

     let headers = new Headers({'Accept': 'application/json;odata=verbose','Authorization':`Basic ${btoa(window.localStorage.getItem('username')+':'+window.localStorage.getItem('password'))}`});
     let options = new RequestOptions({ headers: headers });

     return Promise.all([this.http.get(listGet,options).timeout(consts.timeoutDelay).retry(consts.retryCount).toPromise(),this.http.get(getUrl,options).timeout(consts.timeoutDelay).retry(consts.retryCount).toPromise()])
          .then( res => {
             res[0] = res[0].json().d.results;
             res[1] = res[1].json().d.results;
             return res;
          })
          .catch( error =>{
            console.error('<MyTasks> Loading Counts Tasks error!',error);
            return [[],[]];
         })
  }

  private resetCounts() : void{
    this.counts = {
      new : 0,
      active : 0,
      late : 0,
      done : 0
    };
  }

}
