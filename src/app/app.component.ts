import { Component, ViewChild ,NgZone, Inject} from '@angular/core';
import { Nav, Platform , AlertController , LoadingController, ToastController, Events } from 'ionic-angular';
import { StatusBar, Splashscreen, NativeStorage , Network } from 'ionic-native';
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

  errorCounter : number;
  // secureStorage: SecureStorage;
  siteUrl = consts.siteUrl;
  rootPage: any = MyTasks;
  pages: Array<{title: string, icon:string, component: any , listGUID  : string }>;
  loader : any;
  toast : any;

  constructor(public platform: Platform, public alertCtrl: AlertController,public loadingCtrl: LoadingController,public toastCtrl: ToastController, public auth: Auth,@Inject(Http) public http: Http, public events: Events, private zone:NgZone, @Inject(User) public user : User) {
    this.initializeApp();
    this.errorCounter = 0;
    this.pages = [
      { title: 'Мои задачи', icon:"home", component: MyTasks , listGUID : 'none'}
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      StatusBar.styleDefault();
      Splashscreen.hide();

      this.checkNetwork().then(()=>{
         if(!(this.auth.checkAuthAlready(consts.siteUrl))){
            this.showPrompt();
         } else if(!(this.auth.checkAuthActive(consts.siteUrl))){
            this.reLogin();
         } else {
            this.startApp();
         }
      })
      .catch((reason : string)=>{
         this.presentLoading();
         this.showToast(reason);
      })
    });
  }

  checkNetwork() : Promise<any>{
    if(Network.connection != 'none'){
      return Promise.resolve();
    }
    return Promise.reject('There is no internet connection');
  }

  getLogin(userName : string , userPassword : string) : void {
     this.presentLoading();
     this.auth.init(consts.siteUrl,{username : userName, password : userPassword});//'oleg.dub@lsdocs30.onmicrosoft.com'  'Ljrevtyn0'
     this.auth.getAuth().then(
        result => {
           this.stopLoading();
           this.startApp();
        },
        errorMessage => {
           this.showPrompt();
           this.showToast(errorMessage);
           this.stopLoading();
        })
  }

  reLogin() : void {
     //this.secureStorage = new SecureStorage();
    // Promise.all([this.secureStorage.get('username'),this.secureStorage.get('password')])
    this.presentLoading();
    NativeStorage.getItem('user')
     .then(
       user => {
          this.stopLoading();
          this.getLogin(user.username, user.password);
       },
       error => {
          console.error('#Native storage: ',error);
          this.stopLoading();
          this.showToast(`Can't load user credentials`);
          this.showPrompt();
       }
     )
  }

  startApp() : Promise<any>{
     this.presentLoading();
      return Promise.all([this.user.init(),this.getLists()])
        .then( res => {
             res[1].json().d.results.map((item,i,mass) => {
                 if(item.ListTitle && item.ListGUID)
                    this.pages.push({ title: item.ListTitle , icon:"folder", component: Contracts , listGUID : item.ListGUID})
             });
             this.events.publish('user:loaded');
             this.stopLoading();
        })
        .catch( error => {
            console.error(`Error in making Burger Menu`,error);
            if(this.errorCounter < 3 && error.status == '403'){
               this.errorCounter++;
               this.stopLoading();
               this.reLogin();
            } else {
               this.showToast('Can`t load entrance data');
            }
        })
  }

  openPage(page) {
    this.nav.setRoot(page.component,{title : page.title , guid : page.listGUID });
  }

  getLists() : Promise<any>{
    let listGet = `${consts.siteUrl}/_api/Web/Lists/getByTitle('LSListInLSDocs')/Items?$select=ListTitle,ListURL,ListGUID`;

    let headers = new Headers({'Accept': 'application/json;odata=verbose'});
    let options = new RequestOptions({ headers: headers ,withCredentials: true});

    return this.http.get(listGet,options).toPromise();
  }

   showPrompt() : void {
     this.platform.registerBackButtonAction((e)=>{return false;},100); // e.preventDefault();
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
           }
         }
       ]
     });
     prompt.present();
     prompt.onDidDismiss((event) => { });
   }

   presentLoading() : void {
      this.loader = this.loadingCtrl.create({
        content: "Подождите...",
      });
      this.loader.present();
    }

   stopLoading() : void {
      this.loader.dismiss();
   }

   showToast(message: any){
       this.toast = this.toastCtrl.create({
         message: (typeof message == 'string' )? message : message.toString().substring(0,( message.toString().indexOf('&#x') || message.toString().length)) ,
         position: 'bottom',
         showCloseButton : true,
         duration: 9000
       });
       this.toast.present();
   }
}
