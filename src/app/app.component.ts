import { Component, ViewChild ,NgZone} from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { Http, Headers, RequestOptions  } from '@angular/http';

import * as consts from '../utils/Consts';
import { Auth } from '../utils/auth';

import { MyTasks } from '../pages/MyTasks/MyTasks';
import { Contracts } from '../pages/Contracts/Contracts';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = MyTasks;

  pages: Array<{title: string, icon:string, component: any , listGUID  : string }>;

  userName : string;
  userId: number;
  userLoginName: string;

  constructor(public platform: Platform, public auth: Auth, public http: Http, private zone:NgZone) {
    this.initializeApp();
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Мои задачи', icon:"home", component: MyTasks , listGUID : 'none'}
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      
      this.auth.init(consts.siteUrl,{username:'oleg.dub@lsdocs30.onmicrosoft.com',password:'Ljrevtyn0'});
      this.auth.getAuth()
         .then(()=> {
            let listGet = `${consts.siteUrl}/_api/Web/Lists/getByTitle('LSListInLSDocs')/Items?$select=ListTitle,ListURL,ListGUID`;
            
            let headers = new Headers({'Accept': 'application/json;odata=verbose'});
            let options = new RequestOptions({ headers: headers ,withCredentials: true});

            return this.http.get(listGet,options).toPromise()
         })
         .then( res => {
               res.json().d.results.map((item,i,mass) => {
                  if(item.ListTitle)
                     this.pages.push({ title: item.ListTitle , icon:"folder", component: Contracts , listGUID : item.ListGUID})
              })
         })
         .then( () => {
            let listGet = `${consts.siteUrl}/_api/Web/CurrentUser?$select=Id,Title,LoginName`;
            
            let headers = new Headers({'Accept': 'application/json;odata=verbose'});
            let options = new RequestOptions({ headers: headers});

            return this.http.get(listGet,options).toPromise()
         })
         .then( res =>{
           console.log('after geting user')
           this.zone.run(() => {
             res = res.json();
             this.userName = res.d.Title;
             this.userId = res.d.Id;
             this.userLoginName = res.d.LoginName;
           })
           .then( () => {
             console.log('hiddin splash screen')
             Splashscreen.hide();
           })
         })
         .catch( error => {
           console.error(`Error in makein Burger Menu`,error);
         })
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component,{title : page.title , guid : page.listGUID });
  }
}
