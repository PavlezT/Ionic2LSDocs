import { Transfer, NativeStorage } from 'ionic-native';
import { Injectable } from '@angular/core';
import * as consts from './Consts';

declare var cordova:any;

@Injectable()
export class Images {

   images : any;
   fileTransfer :any;

   constructor() {
     this.fileTransfer = new Transfer();
     this.images = {};
   }

   public _init() : void {
      this.fileTransfer = new Transfer();
      this.imagesLoad().then(res => {this.images = res})
   }

   private imagesLoad() : Promise<any> {
      return NativeStorage.getItem('images').catch(err=>{console.log('<Images> loading images error',err);return {};});//.then(data=>{console.log('<Images> images loaded',data);return data;})
   }

   private saveImage() : Promise<any> {
      return NativeStorage.setItem('images',this.images).catch(err=>{console.log('<Images> error saving images',err)})
   }

   private loadImage(key : string) :  string {
      let listGet = `${consts.siteUrl}/_layouts/15/userphoto.aspx?size=S&accountname=${key}&mobile=0`;
      // try{
      //       this.images[key] = (cordova.file.applicationDirectory + 'www/assets/icon/favicon.ico');
      // }catch(e){
      //   console.log('eror images load',e);
          this.images[key] = listGet;
      //}
      //console.log('fileTransfer', this.fileTransfer);
      //cordova.file.dataDirectory &&  cordova.file.dataDirectory+
      // this.fileTransfer.download(listGet,key+'.png',true,{headers:{'Content-Type':`image/png`,'Accept':`image/webp`,'Authorization':`Basic ${btoa(window.localStorage.getItem('username')+':'+window.localStorage.getItem('password'))}`}})
      //    .then(data=>{
      //       console.log('<Image> file transfer success',data);
      //       this.images[key] = data.nativeURL;
      //       this.saveImage();
      //    })
      //    .catch(err=>{
      //       console.log('<Images> file transfer error',err);
      //    })

      return this.images[key];
   }

   public getImage(key : string) : string {
       return this.images[key] || this.loadImage(key);
   }

}
