import { Component , Inject } from '@angular/core';
import { Platform , NavController ,ModalController, Events } from 'ionic-angular';
import { Http, Headers, RequestOptions  } from '@angular/http';
import * as moment from 'moment';
import 'moment/locale/pt-br';

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
                  item.StartDate = moment(item.StartDate).format("dd, DD MMMM");
                  item.TaskDueDate = moment(item.TaskDueDate).format("dd, DD MMMM");
                  return item;
                });
            })
            .catch( error => {
                console.error('<LSNew> Fail loading ',error);
                this.items = [];
            });
   }

   getNewTasks() : Promise<any> {
     let listGet = `${consts.siteUrl}/_api/Web/Lists/GetByTitle('LSTasks')/items?$select=sysIDItem,ContentTypeId,AssignetToEmail,AssignetToTitle,ID,sysIDList,Title,StartDate,ContentTypeId,ContentType/Name,sysTaskLevel,TaskResults,TaskDescription,sysIDMainTask,sysIDParentMainTask,TaskDueDate,OData__Status,TaskAuthore/Title,TaskAuthore/EMail,AssignedToId,AssignedTo/Title,AssignedTo/EMail&$expand=TaskAuthore/Title,TaskAuthore/EMail,AssignedTo/Title,AssignedTo/EMail,ContentType/Name&$filter=(AssignetToEmail eq '${this.user.getEmail()}') and (OData__Status eq 'Not Started')&$orderby=TaskDueDate%20asc&$top=1000`;

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