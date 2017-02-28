import { Injectable } from '@angular/core';
import { LoadingController, Loading } from 'ionic-angular';

@Injectable()
export class Loader {
    loader : Loading;
    calls : Array<number>;

    constructor(public loadingCtrl: LoadingController){
        this.calls =[];
    }

    presentLoading() : Promise<any> {
    console.log('<Loader> presentLoading',this.loader);
    console.log('<Loader> presentLoading calls',this.calls);
    //if(this.loader){console.log('<Loader>loader alredy loading');return;}
    this.calls.push(1);
    if(this.calls.length>1){return Promise.resolve();};
    
    this.loader = this.loadingCtrl.create({
      content: "Подождите...",
    });
    console.log('nav',this.loader.getNav())
    return this.loader.present();
   }

   stopLoading() : void {
     console.log('<Loader>stoploading',this.loader);
     console.log('<Loader>stoploading calls',this.calls);
     //if(!this.loader){console.log('<Loader>there is no loader');return;}
     this.calls.pop();

     if(this.calls.length==0){
        this.loader.dismiss().then(()=>{this.loader=null})
     }
        //this.loader=null;
  }

}