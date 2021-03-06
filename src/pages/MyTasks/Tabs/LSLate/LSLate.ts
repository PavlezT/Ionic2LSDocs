import { Component , Inject, ViewChild } from '@angular/core';
import { NavController, ModalController, Events, Slides } from 'ionic-angular';
import { Http, Headers, RequestOptions  } from '@angular/http';
import * as moment from 'moment';
import 'moment/locale/uk';

import * as consts from '../../../../utils/consts';
import { User } from '../../../../utils/user';
import { TaskItem } from '../../TaskItem/TaskItem';
import { Images } from '../../../../utils/images';
import { Localization } from '../../../../utils/localization';

@Component({
  selector: 'LSLate',
  templateUrl: 'LSLate.html'
})
export class LSLate {
  @ViewChild('mySlider') slider: Slides;
   items : Array<any>;
   siteUrl : string;

   constructor(public navCtrl: NavController, public modalCtrl: ModalController,@Inject(Images) public images: Images, public events: Events,@Inject(Localization) public loc : Localization, @Inject(Http) public http: Http, @Inject(User) public user : User) {
       this.siteUrl = consts.siteUrl;
       events.subscribe('task:doneTask',()=>{
            this.loadTasks();
       });
       events.subscribe('task:towork',()=>{
            this.loadTasks();
       });
       events.subscribe('user:loaded',()=>{
            this.loadTasks();
       })
       this.loadTasks();
   }

//    ionViewDidLoad(){
//         let self = this;
//         this.slider.ionDrag.delay(consts.swipeDelay).subscribe(
//            data=>{
//                if(data.swipeDirection == "prev")
//                     self.events.publish('slide:change',1);
//                 else
//                     self.events.publish('slide:change',3);
//             },
//            error=>{console.log('ion drag error',error)}
//         )
//    }

   private loadTasks() : Promise<any> {
     return this.user.getUserProps()
          .then(() => {
              moment.locale(this.loc.localization);
              return this.getNewTasks();
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
              console.error('<LSLate> Fail loading ',error);
              this.items = [];
          })
   }

   getNewTasks() : Promise<any>{
     let listGet = `${consts.siteUrl}/_api/Web/Lists/GetByTitle('LSTasks')/items?$select=sysIDItem,StateID,ContentTypeId,AssignetToEmail,AssignetToTitle,ID,sysIDList,Title,StartDate,ContentTypeId,ContentType/Name,sysTaskLevel,TaskResults,TaskDescription,sysIDMainTask,sysIDParentMainTask,TaskDueDate,OData__Status,TaskAuthore/Title,TaskAuthore/EMail,AssignedToId,AssignedTo/Title,AssignedTo/EMail&$expand=TaskAuthore/Title,TaskAuthore/EMail,AssignedTo/Title,AssignedTo/EMail,ContentType/Name&$filter=(AssignetToEmail eq '${this.user.getEmail()}') and (OData__Status ne 'Done') and (TaskDueDate lt datetime'${(new Date((new Date()).getFullYear(),(new Date()).getMonth(),(new Date()).getDate())).toJSON()}')&$orderby=TaskDueDate%20asc&$top=1000`;

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

   doRefresh(refresher){
    this.events.publish('task:checked');
    this.loadTasks()
     .then(()=>{
         refresher.complete();
     })
}

}
