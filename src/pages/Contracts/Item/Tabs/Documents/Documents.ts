import { Component, Inject, ViewChild } from '@angular/core';
import { Transfer, FileOpener,File } from 'ionic-native';
import { NavController, NavParams, ToastController,Events, Slides  } from 'ionic-angular';
import { SelectedItem } from '../../../../../utils/selecteditem';
import * as consts from '../../../../../utils/Consts';
import { Localization } from '../../../../../utils/localization';
import { Loader } from '../../../../../utils/loader';
import * as mimes from 'mime-types';
import * as trans from 'transliteration.crh';

declare var cordova:any;

@Component({
   selector: 'documents',
   templateUrl: 'Documents.html'
})
export class Documents {
  @ViewChild('mySlider') slider: Slides;
  Docs : Array<any>;
  fileTransfer :any;

  constructor(public navCtrl: NavController, public navParams: NavParams,@Inject(Loader) public loaderctrl: Loader,public events: Events, @Inject(Localization) public loc : Localization, @Inject(SelectedItem) public selectedItem : SelectedItem,public toastCtrl: ToastController) {
      this.fileTransfer = new Transfer();
      selectedItem.getItemDocs()
       .then( docs => this.getDocuments(docs) )
  }

  ionViewDidLoad(){
        let self = this;
        this.slider.ionDrag.delay(consts.swipeDelay).subscribe(
           data=>{
               if(data.swipeDirection == "prev")
                    self.events.publish('itemslide:change',0);
               else if (data.swipeDirection == "next")
                    self.events.publish('itemslide:change',2);
            },
           error=>{console.log('ion drag error',error)},
           ()=>{console.log('ion complete ionDrag',)}
       )
   }

  private getDocuments(docs) : void {
     this.Docs = docs.map( (item, i , arr) => {
        item.TimeCreated = (new Date(item.TimeCreated)).toLocaleString();
        item.icon = item.Name.substring(item.Name.lastIndexOf('.')+1,item.Name.length);
        return item;
     });
  }

  public docClicked(doc) : void {
    let nativeURL = (cordova.file.documentsDirectory || cordova.file.externalDataDirectory || cordova.file.cacheDirectory );
    this.loaderctrl.presentLoading();
    
    doc.localName = this.getLocalName(doc.Name);
    
    File.checkFile(nativeURL,doc.localName).then(
      data => {this.opendDocs(nativeURL+doc.localName,doc.localName)},
      error => {this.downloadDoc(nativeURL,doc)}
    )     
  }

  private downloadDoc(nativeURL : string, doc : any) : void {
    let url =`${consts.siteUrl}/_layouts/15/download.aspx?`+(doc.UniqueId? ('UniqueId='+doc.UniqueId ) : ('SourceUrl='+encodeURI(doc.ServerRelativeUrl)) );
    
    this.fileTransfer && this.fileTransfer.download(url, nativeURL + doc.localName,true,{headers:{'Authorization':`Basic ${btoa(window.localStorage.getItem('username')+':'+window.localStorage.getItem('password'))}`}})
         .then(data=>{
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

  private getLocalName(name) : String {
    let newName : string = trans.crh.fromCyrillic(name.toLowerCase().replace(/ы/g,'u').replace(/ї/g,'i').replace(/я/g,'ya').replace(/ч/g,'ch').replace(/ь/g,'').replace(/ъ/g,'').replace(/ш/g,'sch').replace(/щ/g,'sch').replace(/ю/g,'u').replace(/є/g,'e'));
    newName = newName.toLowerCase().replace(/ /g,'_');
    return decodeURI(newName);
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
