import { Component , Inject } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { Http, Headers, RequestOptions  } from '@angular/http';
import * as moment from 'moment';
import 'moment/locale/pt-br';

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

   constructor(public navCtrl: NavController,public modalCtrl: ModalController,@Inject(Http) public http: Http, @Inject(User) public user : User) {
      this.siteUrl = consts.siteUrl;
      moment.locale('ru');
      this.user.getUserProps()
         .then(() => {
            return this.getEndedTasks()
         })
         .then( tasks => {
            this.items = JSON.parse( (JSON.parse(tasks._body)).d.results[0].UserHistory || '[]');
            this.items = this.items.filter((item,i,arr)=> {
               item.StartDate = moment(item.StartDate).format("dd, DD MMMM");
               item.DueDate = moment(item.DueDate).format("dd, DD MMMM");
               if(item.EventType && item.EventType.includes('EventDoneTask'))
                  return item;
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

     return this.http.get(listGet,options).toPromise();
   }

   itemTapped(event, item){
      let modal = this.modalCtrl.create(TaskItem,{
        item : item
      });
      modal.present();
   }

}
