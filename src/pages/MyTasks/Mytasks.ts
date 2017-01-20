import { Component, Inject } from '@angular/core';
import { NavController, Events, Platform, LoadingController } from 'ionic-angular';
import { Http, Headers, RequestOptions  } from '@angular/http';

import { User } from '../../utils/user';
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
   loader : any;

   chatParams : any;

  constructor(public navCtrl: NavController,public platform : Platform,public loadingCtrl: LoadingController,@Inject(Http) public http : Http, public events: Events, @Inject(User) public user : User) {
     this.tabNew =  LSNew;
     this.tabActive = LSActive;
     this.tabLate = LSLate;
     this.tabEnded = LSEnded;
     this.counts = {
        new : 0,
        active : 0,
        late : 0,
        done : 0
     };
     
      platform.ready().then(()=>{
        events.subscribe('user:loaded',()=>{
            this.presentLoading();
            this.setTasksCount().then(()=>this.stopLoading());
        });
        events.subscribe('task:checked',()=>{
              this.counts = {
                  new : 0,
                  active : 0,
                  late : 0,
                  done : 0
            };
           // this.presentLoading();
            console.log('task:checked');
            this.setTasksCount()//.then(()=>this.stopLoading());
        });
        this.presentLoading();
        this.setTasksCount().then(()=>this.stopLoading());
      })

      this.chatParams = {'d':'bb'};
  }

  ionViewDidEnter(){
    this.platform.registerBackButtonAction((e)=>{this.platform.exitApp();return false;},100);
  }

  setTasksCount() : Promise<any> {
     return this.user.getUserProps()
      .then( (status) => {
        console.log('status',status);
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
      .catch( error => {
         console.log('<MyTasks> setting Count Tasks error',error);
         this.counts = {};
      })
  }

  getTasksCount() : Promise<any> {
     let getUrl = `${consts.siteUrl}/_api/Web/Lists/GetByTitle('LSTasks')/items?$select=AssignetToEmail,OData__Status&$filter=(AssignetToEmail eq '${this.user.getEmail()}')&$top=1000`;
     let listGet = `${consts.siteUrl}/_api/Web/Lists/GetByTitle('LSUsersHistory')/items?$select=UserName/EMail,CountTasks&$expand=UserName/EMail&$filter=UserName/EMail eq '${this.user.getEmail()}'&$top=1000`;

     let headers = new Headers({'Accept': 'application/json;odata=verbose'});
     let options = new RequestOptions({ headers: headers });
     console.log('<MyTasks> getTasksCount');
     return Promise.all([this.http.get(listGet,options).timeout(10).retry(3).toPromise().then((res)=>{console.log('Mytasks listGet only history');return res}),this.http.get(getUrl,options).toPromise().then((res)=>{console.log('MyTasks getUrl all tasks');return res;})])
          .then( res => {
            console.log('answer getTasks',res)
             res[0] = res[0].json().d.results;
             res[1] = res[1].json().d.results;
             return res;
          })
          .catch( error =>{
            console.error('<MyTasks> Loading Counts Tasks error!',error);
            return [[],[]];
         })
  }

  presentLoading() : void {
    if(this.loader)return;
    this.loader = this.loadingCtrl.create({
      dismissOnPageChange : true,
      content: "Подождите...",
    });
    this.loader.present();
  }

  stopLoading() : void {
    if(this.loader){
      this.loader.dismiss().then(()=>{console.log('<MyTasks> Data loaded')});
      this.loader = null;
    }
  }
}
