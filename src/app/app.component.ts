import { Component, ViewChild , Inject} from '@angular/core';//NgZone,
import { Nav, Platform , AlertController , ToastController, Events } from 'ionic-angular';
import { StatusBar, Splashscreen, NativeStorage , Network } from 'ionic-native';
import { Http, Headers, RequestOptions  } from '@angular/http';

import * as consts from '../utils/Consts';
import { Auth } from '../utils/auth';
import { Access } from '../utils/access';
import { User } from '../utils/user';
import { Loader } from '../utils/loader';
import { Images } from '../utils/images';

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
  onPremise = consts.OnPremise;
  rootPage: any = MyTasks;
  pages: Array<{title: string, icon:string, component: any , listGUID  : string }>;
  loader : any;
  toast : any;
  // private zone:NgZone,
  constructor(public platform: Platform, public alertCtrl: AlertController,@Inject(Loader) public loaderctrl: Loader,@Inject(Images) public images: Images ,public toastCtrl: ToastController, public auth: Auth,@Inject(Access) public access : Access,@Inject(Http) public http: Http, public events: Events,@Inject(User) public user : User) {
    this.initializeApp();
    this.errorCounter = 0;
    this.pages = [
      { title: 'Мої завдання', icon:"home", component: MyTasks , listGUID : 'none'}
    ];

  }

  ionViewDidEnter(){
    this.platform.registerBackButtonAction((e)=>{this.platform.exitApp();return false;},100);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.loaderctrl.presentLoading();
      StatusBar.overlaysWebView(false);// .styleDefault();
      Splashscreen.hide();
      this.ionViewDidEnter();

      this.checkNetwork().then(()=>{
         this.loaderctrl.stopLoading();
         if(!(this.auth.checkAuthAlready(consts.siteUrl))){
            this.showPrompt();
         } else if(!(this.auth.checkAuthActive(consts.siteUrl))){
            this.reLogin();
         } else {
            this.startApp();
         }
      })
      .catch((reason : string)=>{
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
     this.loaderctrl.presentLoading();
     this.auth.init(consts.siteUrl,{username : userName, password : userPassword});//'oleg.dub@lsdocs30.onmicrosoft.com'  'Ljrevtyn0'
     this.auth.getAuth().then(
        result => {
           this.loaderctrl.stopLoading();
           this.startApp();
        },
        errorMessage => {
           this.showPrompt();
           this.showToast(errorMessage);
           this.loaderctrl.stopLoading();
        })
  }

  reLogin(manual?:boolean) : void {
     //this.secureStorage = new SecureStorage();
    // Promise.all([this.secureStorage.get('username'),this.secureStorage.get('password')])
    this.loaderctrl.presentLoading();
    if(manual){
      NativeStorage.remove('user');
      window.localStorage.removeItem(consts.siteUrl.substring(0,consts.siteUrl.indexOf('/sites/')));
    }
    NativeStorage.getItem('user')
     .then(
       user => {
          this.loaderctrl.stopLoading();
          this.getLogin(user.username, user.password);
       },
       error => {
          !manual && console.error('#Native storage: ',error);
          this.loaderctrl.stopLoading();
          !manual && this.showToast(`Can't load user credentials`);
          this.showPrompt();
       }
     )
  }

  startApp() : Promise<any>{
     this.loaderctrl.presentLoading();
      return Promise.all([this.user.init(),this.getLists()])
        .then( res => {
             this.access._init();
             this.images._init();
             this.pages.splice(1);
             res[1].map((list,i,mass) => {
               if(!list)return;
               list.then(item=>{
                  this.pages.push({ title: item.Title , icon:"folder", component: Contracts , listGUID : item.Id})
               })
             });
             this.events.publish('user:loaded');
             this.loaderctrl.stopLoading();
        })
        .catch( error => {
            console.log(`<App> Error in making Burger Menu`,error);
            if(this.errorCounter < 3 && error.status == '403'){
               this.errorCounter++;
               this.loaderctrl.stopLoading();
               this.reLogin();
            } else if(this.errorCounter < 3 && error.status == '401'){
               this.errorCounter++;
               this.showPrompt();
               this.loaderctrl.stopLoading();
               this.showToast('Check your credentials');
            } else {
               this.showToast('Can`t load entrance data');
               //this.loaderctrl.stopLoading(); //////remove
            }
        })
  }

  public openPage(page) : void {
    this.nav.setRoot(page.component,{title : page.title , guid : page.listGUID });
  }

  private getLists() : Promise<any> {
    let listGet = `${consts.siteUrl}/_api/Web/Lists/getByTitle('LSListInLSDocs')/Items?$select=ListTitle,ListURL,ListGUID`;

    let headers = new Headers({'Accept': 'application/json;odata=verbose','Authorization':`Basic ${btoa(window.localStorage.getItem('username')+':'+window.localStorage.getItem('password'))}`});
    let options = new RequestOptions({ headers: headers });//,withCredentials: true});

    return this.http.get(listGet,options).timeout(consts.timeoutDelay).retry(consts.retryCount).toPromise()
      .then( response =>{
          return response.json().d.results.map(item => {
            return (item.ListGUID && !item.ListTitle) ? this.getListProps(item.ListGUID) : null;
          })
      })
  }

  private getListProps(guid : string) : Promise<any>{
    let listGet = `${consts.siteUrl}/_api/Web/Lists(guid'${guid}')?$select=Title,Id,ItemCount`;

    let headers = new Headers({'Accept': 'application/json;odata=verbose','Authorization':`Basic ${btoa(window.localStorage.getItem('username')+':'+window.localStorage.getItem('password'))}`});
    let options = new RequestOptions({ headers: headers });//,withCredentials: true});

    return this.http.get(listGet,options).timeout(consts.timeoutDelay).retry(consts.retryCount).toPromise().then(res => { return res.json().d })
  }

  public userTapped() : void {
    let prompt = this.alertCtrl.create({
      title: 'Вийти',
      message: "Вийти із даного облікового запису і зайти під іншим",
      enableBackdropDismiss: true,
      buttons: [
        {
          text: 'Скасувати',
          handler: data => {
            prompt.dismiss();
          }
        },
        {
          text: 'Підтвердити',
          handler: data => {
            this.reLogin(true);
          }
        }
      ]
    });
    prompt.present();
    prompt.onDidDismiss((event) => { });
  }

  private showPrompt() : void {
    this.platform.registerBackButtonAction((e)=>{return false;},100); // e.preventDefault();
    let prompt = this.alertCtrl.create({
      title: 'Вхід',
      message: "Введіть свій email и пароль для входу",
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
          text: 'Підтвердити',
          handler: data => {
            this.getLogin(data.Email,data.Password);
          }
        }
      ]
    });
    prompt.present();
    prompt.onDidDismiss((event) => { });
  }

  private showToast(message: any){
      this.toast = this.toastCtrl.create({
        message: (typeof message == 'string' )? message : message.toString().substring(0,( message.toString().indexOf('&#x') || message.toString().length)) ,
        position: 'bottom',
        showCloseButton : true,
        duration: 9000
      });
      this.toast.present();
  }
}
