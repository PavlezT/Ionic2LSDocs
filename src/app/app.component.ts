import { Component, ViewChild ,NgZone} from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { Http, Headers, RequestOptions  } from '@angular/http';

import * as consts from './Consts';

import { MyTasks } from '../pages/MyTasks/MyTasks';
import { Contracts } from '../pages/Contracts/Contracts';

import { Auth } from './auth';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = MyTasks;

  pages: Array<{title: string, icon:string, component: any , listGUID  : string }>;

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
      Splashscreen.hide();

      //let auth =  new Auth();
      this.auth.init(consts.siteUrl,{username:'xxx',password:'xxx'});
      this.auth.getAuth()
         .then(()=> {
            let listGet = `${consts.siteUrl}/_api/Web/Lists/getByTitle('LSListInLSDocs')/Items?$select=ListTitle,ListURL,ListGUID`;

            let headers = new Headers({'Accept': 'application/json;odata=verbose'});
            let options = new RequestOptions({ headers: headers });

            return this.http.get(listGet,options).toPromise()
         })
         .then( res => {
            this.zone.run(() => {
               res.json().d.results.map((item,i,mass) => {
                  if(item.ListTitle)
                     this.pages.push({ title: item.ListTitle , icon:"folder", component: Contracts , listGUID : item.ListGUID})
               })
           });
         })
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component,{title : page.title , guid : page.listGUID });
  }
}
