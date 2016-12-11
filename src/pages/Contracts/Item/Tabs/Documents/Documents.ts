import { Component, Inject } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SelectedItem } from '../../../../../utils/selecteditem';

@Component({
   selector: 'documents',
   templateUrl: 'Documents.html'
})
export class Documents {

  Docs : Array<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams, @Inject(SelectedItem) public selectedItem : SelectedItem) {
      selectedItem.getItemDocs()
       .then( docs => this.getDocuments(docs) )
  }

  getDocuments(docs) : void {
     this.Docs = docs.map( (item, i , arr) => {
        item.TimeCreated = (new Date(item.TimeCreated)).toLocaleString();
        item.icon = item.Name.substring(item.Name.lastIndexOf('.')+1,item.Name.length);
        return item;
     });
  }

}
