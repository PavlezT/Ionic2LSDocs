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
  selector: 'LSActive',
  templateUrl: 'LSActive.html'
})
export class LSActive {
  @ViewChild('mySlider') slider: Slides;

  items : Array<any>;
  siteUrl : string;

  constructor(public navCtrl: NavController,public modalCtrl: ModalController,public events: Events, @Inject(Localization) public loc : Localization,@Inject(Images) public images: Images,@Inject(User) public user : User, @Inject(Http) public http: Http, ) {
     this.siteUrl = consts.siteUrl;
     events.subscribe('task:towork',()=>{
       console.log('<LSActive> task:towork');
            this.loadTasks();
     });
     events.subscribe('task:doneTask',(item)=>{
      console.log('<LSActive> task:doneTask',item);
            this.loadTasks();
     });
     events.subscribe('user:loaded',()=>{
            this.loadTasks();
     })
     this.loadTasks();
  }

  // ionViewDidLoad(){
  //     let self = this;
  //     this.slider.ionDrag.delay(consts.swipeDelay).subscribe(
  //          data=>{
  //              if(data.swipeDirection == "prev")
  //                   self.events.publish('slide:change',0);
  //               else
  //                   self.events.publish('slide:change',2);
  //           },
  //          error=>{console.log('ion drag error',error)}
  //     );
  // }

  private loadTasks() : Promise<any> {
    return this.user.getUserProps()
      .then(() => {
        moment.locale(this.loc.localization);
        return this.getActiveTasks()
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
        console.error('<LSActive> Fail loading ',error);
        this.items = [];
      })
  }

  getActiveTasks(loadNew? : boolean) : Promise<any> {
    let lastId = this.items && loadNew ? this.items[this.items.length-1].ID : false;
    let listGet = `${consts.siteUrl}/_api/Web/Lists/GetByTitle('LSTasks')/items?${ loadNew ? '$skiptoken=Paged=TRUE=p_SortBehavior=0=p_ID='+lastId+'&' : ''}$select=sysIDItem,ContentTypeId,AssignetToEmail,AssignetToTitle,ID,sysIDList,Title,StartDate,ContentTypeId,ContentType/Name,sysTaskLevel,TaskResults,TaskDescription,sysIDMainTask,sysIDParentMainTask,TaskDueDate,StateID,OData__Status,TaskAuthore/Title,TaskAuthore/EMail,AssignedToId,AssignedTo/Title,AssignedTo/EMail&$expand=TaskAuthore/Title,TaskAuthore/EMail,AssignedTo/Title,AssignedTo/EMail,ContentType/Name&$filter=(AssignetToEmail eq '${this.user.getEmail()}') and (OData__Status eq 'In Progress')&$orderby=TaskDueDate%20asc&$top=1000`;

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
