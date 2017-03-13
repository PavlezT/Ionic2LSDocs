import { Component, Inject } from '@angular/core';
//import { Transfer, FileOpener } from 'ionic-native';
import { NavController, NavParams } from 'ionic-angular';
import { SelectedItem } from '../../../../../utils/selecteditem';
import * as consts from '../../../../../utils/Consts';

declare var cordova:any;

@Component({
   selector: 'documents',
   templateUrl: 'Documents.html'
})
export class Documents {

  Docs : Array<any>;
  fileTransfer :any;

  constructor(public navCtrl: NavController, public navParams: NavParams, @Inject(SelectedItem) public selectedItem : SelectedItem) {
    //  this.fileTransfer = new Transfer();
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
    let docGet =`${consts.siteUrl}/_layouts/15/download.aspx?UniqueId=${doc.UniqueId}`;//5090dd89%2D2992%2D4779%2D8c20%2D4f6a328b863c`
    console.log('doc',doc);
    // this.fileTransfer && this.fileTransfer.download(docGet, (cordova.file.documentsDirectory || cordova.file.externalDataDirectory) + doc.Name,true,{headers:{'Authorization':`Basic ${btoa(window.localStorage.getItem('username')+':'+window.localStorage.getItem('password'))}`}})
    //      .then(data=>{
    //         console.log('<Documents> file transfer success',data);
    //         FileOpener.open(data.nativeURL,'text\\doc').then(data=>{console.log('opener data',data)}).catch(err=>{console.log('opener error',err)})
    //      })
    //      .catch(err=>{
    //         console.log('<Documents> file transfer error',err);
    //      })
  }

  public opendDocs() : void {

  }

}
