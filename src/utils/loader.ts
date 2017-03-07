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
      this.calls.push(1);
      if(this.calls.length>1){return Promise.resolve();};
      
      this.loader = this.loadingCtrl.create({
        content: "Подождите...",
      });

      return this.loader.present();
   }

   stopLoading() : Promise<any> {
      this.calls.pop();

      if(this.calls.length==0){
        try{
          return this.loader.dismiss().then(()=>{this.loader=null})
        }catch(e){
          console.log('<Loader> error in loader',e);
          console.log('<Loader> this. loader',this.loader);
          
        }
      }
      return Promise.resolve();
  }

}
