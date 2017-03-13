import { Transfer, NativeStorage } from 'ionic-native';
import { Injectable} from '@angular/core';
import * as consts from './Consts';

declare var cordova:any;

@Injectable()
export class Images {

   images : any;
   fileTransfer :any;

   constructor() {
     this.images = {}; 
     try{
       console.log('transer',Transfer);
       this.fileTransfer = new Transfer();
     } catch(e){
       console.log('trasfer error',e);
      }
   }

   public _init() : void {
     try{
      this.fileTransfer = new Transfer();
     }catch(e){console.log('_initing error',e)};
      console.log('_init this.fileTrasfer',this.fileTransfer)

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

      try{
            this.images[key] = consts.OnPremise?(cordova.file.applicationDirectory + 'www/assets/icon/favicon.ico') : listGet;
      }catch(e){
        console.log('eror images load: this.image[key]= ',e);
          this.images[key] = listGet;
      }

      //console.log('fileTransfer', this.fileTransfer);
      //cordova.file.dataDirectory &&  cordova.file.dataDirectory+
      console.log('this.fileTrasfer',this.fileTransfer);
      try{
      this.fileTransfer && this.fileTransfer.download(listGet,key+'.png',true,{headers:{'Content-Type':`image/png`,'Accept':`image/webp`,'Authorization':`Basic ${btoa(window.localStorage.getItem('username')+':'+window.localStorage.getItem('password'))}`}})
         .then(data=>{
            console.log('<Image> file transfer success',data);
            this.images[key] = data.nativeURL;
            this.saveImage();
         })
         .catch(err=>{
            console.log('<Images> file transfer error',err);
         })
      }catch(e){console.log('loadImage error',e)}

      return this.images[key];
   }

   public getImage(key : string) : string {
       return this.images[key] || this.loadImage(key);
   }

}
