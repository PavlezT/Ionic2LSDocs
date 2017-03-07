import { Transfer } from 'ionic-native';
import { Injectable } from '@angular/core';
import * as consts from './Consts';

declare var cordova:any;
const fileTransfer = new Transfer();

@Injectable()
export class Images {

   constructor(){
      this.imagesLoad();
   }

   private imagesLoad() : void {
      let listGet = `${consts.siteUrl}/_layouts/15/userphoto.aspx?size=S&accountname=mark.leon@competence.net`;

      fileTransfer.download(listGet,cordova.file.dataDirectory+'userphoto.png',true,{headers:{'Authorization':`Basic ${btoa(window.localStorage.getItem('username')+':'+window.localStorage.getItem('password'))}`}})
         .then(data=>{
            console.log('file transfer success',data);
         })
         .catch(err=>{
            console.log('file transfer error',err);
         })
   }

   public getImage() : string {
      let path;
      return path;
   }

}
