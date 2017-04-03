import { Component , Inject, ViewChild } from '@angular/core';
import { NavController, ModalController,Events, Slides } from 'ionic-angular';
import { Http, Headers, RequestOptions  } from '@angular/http';
import * as moment from 'moment';
import 'moment/locale/uk';

import * as consts from '../../../../utils/Consts';
import { User } from '../../../../utils/user';
import { TaskItem } from '../../TaskItem/TaskItem';
import { Images } from '../../../../utils/images';
import { Localization } from '../../../../utils/localization';

@Component({
  selector: 'LSEnded',
  templateUrl: 'LSEnded.html'
})
export class LSEnded {
  @ViewChild('mySlider') slider: Slides;
   items : Array<any>;
   siteUrl : string;

   constructor(public navCtrl: NavController,public modalCtrl: ModalController,public events: Events,@Inject(Localization) public loc : Localization,@Inject(Images) public images: Images, @Inject(Http) public http: Http, @Inject(User) public user : User) {
      this.siteUrl = consts.siteUrl;
      events.subscribe('task:doneTask',()=>{
            this.loadTasks();
      });
      events.subscribe('user:loaded',()=>{
            this.loadTasks();
        });
      this.loadTasks();
   }

   ionViewDidLoad(){
      let self = this;
      this.slider.ionDrag.delay(consts.swipeDelay).subscribe(
        data=>{
               if(data.swipeDirection == "prev")
                    self.events.publish('slide:change',2);
            },
        error=>{console.log('ion drag error',error)}
      )
   }

   private loadTasks() : void {
     this.user.getUserProps()
         .then(() => {
            moment.locale(this.loc.localization);
            return this.getEndedTasks()
         })
         .then( tasks => {
            this.items = JSON.parse( (JSON.parse(tasks._body)).d.results[0].UserHistory || '[]');
            this.items = this.items.filter((item,i,arr)=> {
               if(!!item.TaskType){//if(item.EventType && (item.EventType.includes('EventDoneTask') ))//|| item.EventType.includes('Close')
                  item.StartDate_view = moment.utc(item.StartDate.split(' ')[0].split('.').reverse().join('-')).format("dd, DD MMMM");
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

     let headers = new Headers({'Accept': 'application/json;odata=verbose','Authorization':`Basic ${btoa(window.localStorage.getItem('username')+':'+window.localStorage.getItem('password'))}`});
     let options = new RequestOptions({ headers: headers ,withCredentials: true});

     return this.http.get(listGet,options).timeout(consts.timeoutDelay).retry(consts.retryCount).toPromise();
   }

   itemTapped(event, item){
      let modal = this.modalCtrl.create(TaskItem,{
        item : item
      });
      modal.present();
   }

}
