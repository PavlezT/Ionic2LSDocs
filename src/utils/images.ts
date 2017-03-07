import { Transfer, NativeStorage } from 'ionic-native';
import { Injectable } from '@angular/core';
import * as consts from './Consts';

declare var cordova:any;
const fileTransfer = new Transfer();

@Injectable()
export class Images {

   images : any;//Array<string>;

   constructor() {
      this.images = {};
   }

   public _init() : void {
      this.imagesLoad().then(res => {this.images = res;})
   }

   private imagesLoad() : Promise<any> {
      return NativeStorage.getItem('images');
   }

   private saveImage() : void {
      NativeStorage.setItem('images',this.images);
   }

   private loadImage(key : string) :  string {
      let listGet = `${consts.siteUrl}/_layouts/15/userphoto.aspx?size=S&accountname=${key}`;//mark.leon@competence.net

      fileTransfer.download(listGet,cordova.file.dataDirectory+key+'.png',true,{headers:{'Authorization':`Basic ${btoa(window.localStorage.getItem('username')+':'+window.localStorage.getItem('password'))}`}})
         .then(data=>{
            console.log('file transfer success',data);
            this.images[key] = data.path;
            this.saveImage();
         })
         .catch(err=>{
            console.log('file transfer error',err);
         })

      return (cordova.file.applicationDirectory + 'www/assets/icon/favicon.ico');
   }

   public getImage(key : string) : string {
       let path = this.images[key] || this.loadImage(key)
       return this.images[key] ? this.images[key] : this.loadImage(key); //let path =
      //return path;
   }

}
