import { Component , Inject, ViewChild  } from '@angular/core';
import { Platform , ModalController, Events, Slides } from 'ionic-angular';
import { Http, Headers, RequestOptions  } from '@angular/http';
import * as moment from 'moment';
import 'moment/locale/uk';

import * as consts from '../../../../utils/Consts';
import { User } from '../../../../utils/user';
import { TaskItem } from '../../TaskItem/TaskItem';
import { Images } from '../../../../utils/images';

@Component({
  selector: 'LSNew',
  templateUrl: 'LSNew.html'
})
export class LSNew {
@ViewChild('mySlider') slider: Slides;

   items : Array<any>;
   siteUrl : string;

   constructor(public platform: Platform, @Inject(Images) public images: Images ,public modalCtrl: ModalController, public events: Events, @Inject(Http) public http: Http, @Inject(User) public user : User) {
      this.platform.ready().then(()=> {
        this.siteUrl = consts.siteUrl;
        moment.locale('uk');
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

   ionViewDidLoad(){
        let self = this;
        // this.slider.onTransitionEnd = function(swiper){
        //     if(swiper.swipeDirection == 'next'){
        //        self.events.publish('slide:change',1);
        //     } else {
        //       // self.events.publish('menu:open');
        //     }
        // }
        this.slider.ionDrag.delay(100).subscribe(
           data=>{
               if(data.swipeDirection == "prev")
                    self.events.publish('menu:open');
               else if (data.swipeDirection == "next")
                    self.events.publish('slide:change',1);
            },
           error=>{console.log('ion drag error',error)},
           ()=>{console.log('ion complete ionDrag',)}
       )
   }

   loadTasks() : void {
     this.user.getUserProps()
            .then((status) => {
                if(status)
                    return this.getNewTasks();
                return {_body:JSON.stringify({d:{results:[]}})};
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
                console.log('<LSNew> Fail loading ',error);
                this.items = [];
            });
   }

   getNewTasks(loadNew? : boolean) : Promise<any> {
     let lastId = this.items && loadNew ? this.items[this.items.length-1].ID : false;
     let listGet = `${consts.siteUrl}/_api/Web/Lists/GetByTitle('LSTasks')/items?${ loadNew ? '$skiptoken=Paged=TRUE=p_SortBehavior=0=p_ID='+lastId+'&' : ''}$select=sysIDItem,ContentTypeId,AssignetToEmail,AssignetToTitle,ID,sysIDList,Title,StartDate,ContentTypeId,ContentType/Name,sysTaskLevel,TaskResults,TaskDescription,sysIDMainTask,sysIDParentMainTask,TaskDueDate,OData__Status,TaskAuthore/Title,TaskAuthore/EMail,AssignedToId,AssignedTo/Title,AssignedTo/EMail&$expand=TaskAuthore/Title,TaskAuthore/EMail,AssignedTo/Title,AssignedTo/EMail,ContentType/Name&$filter=(AssignetToEmail eq '${this.user.getEmail()}') and (OData__Status eq 'Not Started')&$orderby=TaskDueDate%20asc&$top=1000`;

     let headers = new Headers({'Accept': 'application/json;odata=verbose','Authorization':`Basic ${btoa(window.localStorage.getItem('username')+':'+window.localStorage.getItem('password'))}`});
     let options = new RequestOptions({ headers: headers });

     return this.http.get(listGet,options).timeout(consts.timeoutDelay).retry(consts.retryCount).toPromise();
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

   //   public swiped(event){
  //      console.log('slide drug',event);
  //      // direction: 4 <-
  //      // direction: 2 ->
  //       if(event.direction == 2)
  //             this.events.publish('slide:change',2);
  //         else if (event.direction == 4)
  //             this.events.publish('slide:change',0);
  //  }
   
}
