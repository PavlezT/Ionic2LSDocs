import { Component , Inject } from '@angular/core';
import { NavController, ModalController,Events } from 'ionic-angular';
import { Http, Headers, RequestOptions  } from '@angular/http';
import * as moment from 'moment';
import 'moment/locale/ru';

import * as consts from '../../../../utils/Consts';
import { User } from '../../../../utils/user';
import { TaskItem } from '../../TaskItem/TaskItem';

@Component({
  selector: 'LSEnded',
  templateUrl: 'LSEnded.html'
})
export class LSEnded {

   items : Array<any>;
   siteUrl : string;

   constructor(public navCtrl: NavController,public modalCtrl: ModalController,public events: Events, @Inject(Http) public http: Http, @Inject(User) public user : User) {
      this.siteUrl = consts.siteUrl;
      moment.locale('ru');
      events.subscribe('task:doneTask',()=>{
            this.loadTasks();
      });
      this.loadTasks();
   }

   private loadTasks() : void {
     this.user.getUserProps()
         .then(() => {
            return this.getEndedTasks()
         })
         .then( tasks => {
            this.items = JSON.parse( (JSON.parse(tasks._body)).d.results[0].UserHistory || '[]');
            this.items = this.items.filter((item,i,arr)=> {
               if(!!item.TaskType){//if(item.EventType && (item.EventType.includes('EventDoneTask') ))//|| item.EventType.includes('Close')
                  item.StartDate_view = moment.utc(item.StartDate.split('.').reverse().join('-')).format("dd, DD MMMM");
                  item.DueDate_view = moment.utc(item.DueDate.split('.').reverse().join('-')).format("dd, DD MMMM");
                  return item;
               }
            });
         })
         .catch( error => {
            console.error('<LSEnded> Fail loading ',error);
            this.items = [];
         })
   }

   getEndedTasks() : Promise<any>{
     let listGet = `${consts.siteUrl}/_api/Web/Lists/GetByTitle('LSUsersHistory')/items?$select=UserName/EMail,CountTasks,UserHistory&$expand=UserName/EMail&$filter=UserName/EMail eq '${this.user.getEmail()}'`;

     let headers = new Headers({'Accept': 'application/json;odata=verbose'});
     let options = new RequestOptions({ headers: headers ,withCredentials: true});

     return this.http.get(listGet,options).timeout(3500).retry(3).toPromise();
   }

   itemTapped(event, item){
      let modal = this.modalCtrl.create(TaskItem,{
        item : item
      });
      modal.present();
   }

}
