import { Component, ViewChild ,NgZone, Inject} from '@angular/core';
import { Nav, Platform , AlertController , LoadingController } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { Http, Headers, RequestOptions  } from '@angular/http';

import * as consts from '../utils/Consts';
import { Auth } from '../utils/auth';
import { User } from '../utils/user';

import { MyTasks } from '../pages/MyTasks/MyTasks';
import { Contracts } from '../pages/Contracts/Contracts';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  siteUrl = consts.siteUrl;
  rootPage: any = MyTasks;
  pages: Array<{title: string, icon:string, component: any , listGUID  : string }>;
  loader : any;

  constructor(public platform: Platform, public alertCtrl: AlertController,public loadingCtrl: LoadingController, public auth: Auth,@Inject(Http) public http: Http, private zone:NgZone, @Inject(User) public user : User) {
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

      if(!(this.auth.checkAuthAlready(consts.siteUrl))){
         this.showPrompt();
      } else {
         this.presentLoading();
         this.startApp();
      }
    });
  }

  getLogin(userName : string , userPassword : string) : void {
     this.presentLoading();
     this.auth.init(consts.siteUrl,{username : userName, password : userPassword});//'oleg.dub@lsdocs30.onmicrosoft.com'  'Ljrevtyn0'
     this.auth.getAuth().then((result) => {
        if(!result){
           this.showPrompt();
           this.stopLoading();
           // throw Error('Auth fault!');
        } else {
           this.startApp();
        }
     })
  }

  startApp() : Promise<any>{
      return Promise.all([this.user.init(),this.getLists()])
        .then( res => {
             res[1].json().d.results.map((item,i,mass) => {
                 if(item.ListTitle && item.ListGUID)
                    this.pages.push({ title: item.ListTitle , icon:"folder", component: Contracts , listGUID : item.ListGUID})
             });
        })
        .then( () => {
            this.stopLoading();
        })
        .catch( error => {
            console.error(`Error in makein Burger Menu`,error);
        });
 }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component,{title : page.title , guid : page.listGUID });
  }

  getLists() : Promise<any>{
    let listGet = `${consts.siteUrl}/_api/Web/Lists/getByTitle('LSListInLSDocs')/Items?$select=ListTitle,ListURL,ListGUID`;

    let headers = new Headers({'Accept': 'application/json;odata=verbose'});
    let options = new RequestOptions({ headers: headers ,withCredentials: true});

    return this.http.get(listGet,options).toPromise();
  }

  showPrompt() {
     let prompt = this.alertCtrl.create({
       title: 'LogIn',
       message: "Введите свой email и пароль для входа",
       enableBackdropDismiss: false,
       inputs: [
         {
           name: 'Email',
           placeholder: 'Email'
         },
         {
           name: 'Password',
           type: 'password',
           placeholder: 'Password'
         }
       ],
       buttons: [
         {
           text: 'Подтвердить',
           handler: data => {
             this.getLogin(data.Email,data.Password);
             console.log('Saved clicked',data);
           }
         }
       ]
     });
     prompt.present();
   }

   presentLoading() : void {
      this.loader = this.loadingCtrl.create({
        content: "Подождите...",
      });
      this.loader.present();
    }

    stopLoading() : void{
      this.loader.dismiss();
   }
}
