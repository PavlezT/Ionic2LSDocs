import { Component , Inject } from '@angular/core';
import { Platform , NavController ,ModalController, Events } from 'ionic-angular';
import { Http, Headers, RequestOptions  } from '@angular/http';
import * as moment from 'moment';
import 'moment/locale/ru';

import * as consts from '../../../../utils/Consts';
import { User } from '../../../../utils/user';
import { TaskItem } from '../../TaskItem/TaskItem';

@Component({
  selector: 'LSNew',
  templateUrl: 'LSNew.html'
})
export class LSNew {

   items : Array<any>;
   siteUrl : string;

   constructor(public platform: Platform, public navCtrl: NavController, public modalCtrl: ModalController, public events: Events, @Inject(Http) public http: Http, @Inject(User) public user : User) {
      this.platform.ready().then(()=> {
        this.siteUrl = consts.siteUrl;
        moment.locale('ru');
        events.subscribe('user:loaded',()=>{
            this.loadTasks();
        });
        events.subscribe('task:towork',()=>{
            console.log('<LSNew> task:towork')
            this.loadTasks();
        });
        this.loadTasks();
      });
   }

   loadTasks() : void {
     this.user.getUserProps()
            .then(() => {
                return this.getNewTasks()
            })
            .then( tasks => {
                this.items = (JSON.parse(tasks._body)).d.results;
                this.items.map((item,i,arr)=>{
                  item.StartDate_view = moment(item.StartDate).format("dd, DD MMMM");
                  item.TaskDueDate_view = moment(item.TaskDueDate).format("dd, DD MMMM");
                  return item;
                });
            })
            .catch( error => {
                console.error('<LSNew> Fail loading ',error);
                this.items = [];
            });
   }

   getNewTasks(loadNew? : boolean) : Promise<any> {
     let lastId = this.items && loadNew ? this.items[this.items.length-1].ID : false;
     let listGet = `${consts.siteUrl}/_api/Web/Lists/GetByTitle('LSTasks')/items?${ loadNew ? '$skiptoken=Paged=TRUE=p_SortBehavior=0=p_ID='+lastId+'&' : ''}$select=sysIDItem,ContentTypeId,AssignetToEmail,AssignetToTitle,ID,sysIDList,Title,StartDate,ContentTypeId,ContentType/Name,sysTaskLevel,TaskResults,TaskDescription,sysIDMainTask,sysIDParentMainTask,TaskDueDate,OData__Status,TaskAuthore/Title,TaskAuthore/EMail,AssignedToId,AssignedTo/Title,AssignedTo/EMail&$expand=TaskAuthore/Title,TaskAuthore/EMail,AssignedTo/Title,AssignedTo/EMail,ContentType/Name&$filter=(AssignetToEmail eq '${this.user.getEmail()}') and (OData__Status eq 'Not Started')&$orderby=TaskDueDate%20asc&$top=1000`;

     let headers = new Headers({'Accept': 'application/json;odata=verbose','Authorization':`Basic ${btoa(window.localStorage.getItem('username')+':'+window.localStorage.getItem('password'))}`});
     let options = new RequestOptions({ headers: headers });

     return this.http.get(listGet,options).timeout(3500).retry(3).toPromise();
   }

   itemTapped(event, item){
      let modal = this.modalCtrl.create(TaskItem,{
        item : item
      });
      modal.present();
   }

   doInfinite(infiniteScroll){
      console.log('do infinite scroll')
     this.getNewTasks(true)
     .then( tasks => {
         let newItems = (JSON.parse(tasks._body)).d.results;
         newItems.map((item,i,arr)=>{
             item.StartDate_view = moment(item.StartDate).format("dd, DD MMMM");
             item.TaskDueDate_view = moment(item.TaskDueDate).format("dd, DD MMMM");
             this.items.push(item);
         });
         infiniteScroll.complete();
       })
   }

}
