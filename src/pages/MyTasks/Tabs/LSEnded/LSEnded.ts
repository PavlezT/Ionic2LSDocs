import { Component , Inject } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http, Headers, RequestOptions  } from '@angular/http';
import * as moment from 'moment';
import 'moment/locale/pt-br';

import * as consts from '../../../../utils/Consts';
import { User } from '../../../../utils/user';

@Component({
  selector: 'LSEnded',
  templateUrl: 'LSEnded.html'
})
export class LSEnded {

   items : Array<any>;
   siteUrl : string;

   constructor(public navCtrl: NavController,@Inject(Http) public http: Http, @Inject(User) public user : User) {
      this.siteUrl = consts.siteUrl;
      moment.locale('ru');
      this.user.getUserProps()
         .then(() => {
            return this.getEndedTasks()
         })
         .then( tasks => {
            this.items = JSON.parse( (JSON.parse(tasks._body)).d.results[0].UserHistory);
            this.items = this.items.map((item,i,arr)=> {
               item.DueDate = moment(item.DueDate).format("dd, DD MMMM");
               if(item.EventType.includes('EventDoneTask'))
                  return item;
            });
         })
         .catch( error => {
            console.error('<LSNew> Fail loading ',error);
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
      console.log('Item in My Tasks tapped',item)
    //   this.selectedItem.set(item,this.guid);
    //   this.navCtrl.push(Item, {
    //    item: item,
    //    listGUID : this.guid
    //   });
   }

}
