import { Component, ViewChild } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { Http, Headers, RequestOptions  } from '@angular/http';

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

  @ViewChild('coments') myInput ;

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
     let listGet = `${consts.siteUrl}/Documents/lsi.listscollection.js`;

     let headers = new Headers({'Accept': 'application/json;odata=verbose'});
     let options = new RequestOptions({ headers: headers ,withCredentials: true});

     return this.http.get(listGet,options).toPromise()
     .then(res => {
        console.log('res data',res);
        //console.log('json data',res.json());
        let b = res.text();
        b = b.replace(/\'/g,`"`).replace(/;/g,'');
        console.log('b',b);
        let c = JSON.parse(b.substring(b.indexOf('LSi.ListsCollection = ')+'LSi.ListsCollection = '.length,b.length));
        console.log('c',c);
     })
  }

  cancelTask(){
     console.log('cancel work')
  }

  executeTask(){
     console.log('execute task');
  }

}
