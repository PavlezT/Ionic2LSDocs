import { Component , Inject } from '@angular/core';
import { NavController, ModalController, Events } from 'ionic-angular';
import { Http, Headers, RequestOptions  } from '@angular/http';
import * as moment from 'moment';
import 'moment/locale/ru';

// import * as ntlm from 'httpntlm/ntlm';

import * as consts from '../../../../utils/Consts';
import { User } from '../../../../utils/user';
import { TaskItem } from '../../TaskItem/TaskItem';

@Component({
  selector: 'LSActive',
  templateUrl: 'LSActive.html'
})
export class LSActive {
  items : Array<any>;
  siteUrl : string;

  constructor(public navCtrl: NavController,public modalCtrl: ModalController,public events: Events,@Inject(User) public user : User, @Inject(Http) public http: Http, ) {
     this.siteUrl = consts.siteUrl;
     moment.locale('ru');
     events.subscribe('task:towork',()=>{
       console.log('<LsActive> task:towork')
            this.loadTasks();
     });
     events.subscribe('task:doneTask',()=>{
            this.loadTasks();
     });
     this.loadTasks();
    // this.onpremise(`http://devdt01.dev.lizard.net.ua:43659/sites/DyckerHoff/`,{domain:'competence',workstation:'',username:'ivan.ivanov',password:'Pa$$w0rd'});
  }

  private loadTasks() : void {
    this.user.getUserProps()
      .then(() => {
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
    let listGet = `${consts.siteUrl}/_api/Web/Lists/GetByTitle('LSTasks')/items?${ loadNew ? '$skiptoken=Paged=TRUE=p_SortBehavior=0=p_ID='+lastId+'&' : ''}$select=sysIDItem,ContentTypeId,AssignetToEmail,AssignetToTitle,ID,sysIDList,Title,StartDate,ContentTypeId,ContentType/Name,sysTaskLevel,TaskResults,TaskDescription,sysIDMainTask,sysIDParentMainTask,TaskDueDate,OData__Status,TaskAuthore/Title,TaskAuthore/EMail,AssignedToId,AssignedTo/Title,AssignedTo/EMail&$expand=TaskAuthore/Title,TaskAuthore/EMail,AssignedTo/Title,AssignedTo/EMail,ContentType/Name&$filter=(AssignetToEmail eq '${this.user.getEmail()}') and (OData__Status eq 'In Progress')&$orderby=TaskDueDate%20asc&$top=1000`;

    let headers = new Headers({'Accept': 'application/json;odata=verbose','Authorization':`Basic ${btoa(window.localStorage.getItem('username')+':'+window.localStorage.getItem('password'))}`});
    let options = new RequestOptions({ headers: headers ,withCredentials: true});

   return this.http.get(listGet,options).timeout(3500).retry(3).toPromise();
  }

  itemTapped(event, item){
      let modal = this.modalCtrl.create(TaskItem,{
        item : item
      });
      modal.present();
   }

  //  doInfinite(infiniteScroll){
  //     console.log('do infinite scroll')
  //    this.getActiveTasks(true)
  //    .then( tasks => {
  //        let newItems = (JSON.parse(tasks._body)).d.results;
  //        newItems.map((item,i,arr)=>{
  //            item.StartDate_view = moment(item.StartDate).format("dd, DD MMMM");
  //            item.TaskDueDate_view = moment(item.TaskDueDate).format("dd, DD MMMM");
  //            this.items.push(item);
  //        });
  //        infiniteScroll.complete();
  //      })
  //  }

  onpremise(siteurl,options) : void {
  //   console.log('http',http);
  //   let b = new http.Agent({ keepAlive: true });
  //   console.log('b',b);
  //   let ntlmOptions = options;
  //   ntlmOptions.url = siteurl;
  //   console.log('ntlm',ntlm);
  //   let type1msg = ntlm.createType1Message(ntlmOptions);
  //   console.log('type1msg',type1msg);

  //   // let headers = new Headers({'Authorization': type1msg,'Accept': 'application/json;odata=verbose'});//'Connection': 'keep-alive',
  //   // let httpOptions = new RequestOptions({ headers: headers,Agent:b });//,strictSSL: false,simple: false ,resolveWithFullResponse : true});

  //   // this.http.get(siteurl,httpOptions).toPromise()
  //   console.log('http.request',
  //   http.request({
  //      url:siteurl,
  //      method: 'GET',
  //           headers: {
  //               'Connection': 'keep-alive',
  //               'Authorization': type1msg,
  //               'Accept': 'application/json;odata=verbose'
  //           },
  //           agent: b,
  //           simple:false
  //   },this.catcher))
  // }

  // catcher(response){
  //     console.log('response ntlm',response);
  //     let message = response.headers.get('www-authenticate');
  //     console.log('message',message);

  //   }
  //   .catch(error=>{
  //     console.log('ntlm error',error);
  //     let message = error.headers.get('www-authenticate');
  //     console.log('message',message);
  //     let type2msg = ntlm.parseType2Message(error.headers.get('www-authenticate'));
  //     let type3msg = ntlm.createType3Message(type2msg, ntlmOptions);
  //     console.log('type3msg',type3msg);

  //     // let headers = new Headers({'Authorization': type3msg,'Accept': 'application/json;odata=verbose'});
  //     // let httpOptions = new RequestOptions({ headers: headers });

  //     // this.http.get(`http://devdt01.dev.lizard.net.ua:43659/sites/DyckerHoff/_api/web/Lists(guid'a4c342e5-3f69-4cbd-8b60-f3cb7b764bd8')/items?$top=15`,httpOptions).toPromise()
  //     http.get()
  //     .then(response=>{
  //       console.log('response from Dycker',response);
  //       console.log('response json',response.json());
  //     })
  //   })
  }

}
