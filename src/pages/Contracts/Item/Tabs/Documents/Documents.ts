import { Component, Inject } from '@angular/core';
import { Transfer, FileOpener,File } from 'ionic-native';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { SelectedItem } from '../../../../../utils/selecteditem';
import * as consts from '../../../../../utils/Consts';
import { Loader } from '../../../../../utils/loader';
import * as mimes from 'mime-types';

declare var cordova:any;

@Component({
   selector: 'documents',
   templateUrl: 'Documents.html'
})
export class Documents {

  Docs : Array<any>;
  fileTransfer :any;

  constructor(public navCtrl: NavController, public navParams: NavParams,@Inject(Loader) public loaderctrl: Loader, @Inject(SelectedItem) public selectedItem : SelectedItem,public toastCtrl: ToastController) {
      this.fileTransfer = new Transfer();
      selectedItem.getItemDocs()
       .then( docs => this.getDocuments(docs) )
  }

  private getDocuments(docs) : void {
     this.Docs = docs.map( (item, i , arr) => {
        item.TimeCreated = (new Date(item.TimeCreated)).toLocaleString();
        item.icon = item.Name.substring(item.Name.lastIndexOf('.')+1,item.Name.length);
        return item;
     });
  }

  public docClicked(doc) : void {
    let nativeURL = (cordova.file.documentsDirectory || cordova.file.externalDataDirectory);
    this.loaderctrl.presentLoading();
    doc.localName = encodeURIComponent(doc.Name.replace(/ /g,'_'));
    File.checkFile(nativeURL,doc.localName).then(
      data => {this.opendDocs(nativeURL+doc.localName,doc.localName)},
      error => {this.downloadDoc(nativeURL,doc)}
    )     
  }

  private downloadDoc(nativeURL : string, doc : any) : void {
    let url =`${consts.siteUrl}/_layouts/15/download.aspx?UniqueId=${doc.UniqueId}`;
    console.log('downloadDoc native urkl:',nativeURL+doc.localName);
    this.fileTransfer && this.fileTransfer.download(url, nativeURL + doc.localName,true,{headers:{'Authorization':`Basic ${btoa(window.localStorage.getItem('username')+':'+window.localStorage.getItem('password'))}`}})
         .then(data=>{
           console.log('downloadDoc success:',data.nativeURL);
            this.opendDocs(data.nativeURL,doc.localName);
         })
         .catch(err=>{
            console.log('<Documents> file transfer error',err);
            this.loaderctrl.stopLoading();
            this.showToast('Can`t download or save this file');
         })
  }

  public opendDocs(nativeURL,docName) : void {
    FileOpener.open(decodeURI(nativeURL),mimes.lookup(decodeURI(docName)))
      .then((data)=>{this.loaderctrl.stopLoading();})
      .catch(err=>{
        this.loaderctrl.stopLoading();
        console.log('<Documents> cant open file:',nativeURL)
        this.showToast('Can`t open this file');
      })
  }

  private showToast(message: any){
      let toast = this.toastCtrl.create({
        message: (typeof message == 'string' )? message : message.toString().substring(0,( message.toString().indexOf('&#x') || message.toString().length)) ,
        position: 'bottom',
        showCloseButton : true,
        duration: 9000
      });
      toast.present();
  }

}
