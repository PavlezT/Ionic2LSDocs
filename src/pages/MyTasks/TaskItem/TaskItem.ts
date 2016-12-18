import { Component, ViewChild } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import * as consts from '../../../utils/Consts';

@Component({
  selector: 'TaskItem',
  templateUrl: 'TaskItem.html'
})
export class TaskItem {
  siteUrl : string;

  task : any;
  Title : string;
  startDate : string;
  deadLine : string;
  assignetTo : {Email : string, Title: string};
  taskAuthore : {Email : string, Title: string};

  @ViewChild('coments') myInput ;

  constructor(public viewCtrl: ViewController, public navParams: NavParams) {
    this.siteUrl = consts.siteUrl;
    this.task = navParams.data.item;
    this.Title = navParams.data.item.Title || navParams.data.item.TaskTitle;
    this.startDate = navParams.data.item.StartDate;
    this.deadLine = navParams.data.item.TaskDueDate || navParams.data.item.DueDate;
    this.assignetTo = navParams.data.item.AssignetToEmail ?{Email: navParams.data.item.AssignetToEmail, Title: navParams.data.item.AssignetToTitle } : {Email: navParams.data.item.ExecutorEmail ,Title: navParams.data.item.NameExecutor};
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
     console.log('to work')
  }

  cancelTask(){
     console.log('cancel work')
  }

  executeTask(){
     console.log('execute task');
  }

}
