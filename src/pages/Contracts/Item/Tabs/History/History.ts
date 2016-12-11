import { Component, Inject } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SelectedItem } from '../../../../../utils/selecteditem';

@Component({
   selector: 'history',
   templateUrl: 'History.html'
})
export class History {

  Docs : Array<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams, @Inject(SelectedItem) public selectedItem : SelectedItem) {
      //this.Docs = [];
      selectedItem.getItemDocs();
      //_api/Web/Lists/GetByTitle('LSHistory')/items?$filter=(ItemId eq '6') and (Title eq 'da50a3c2-3138-4a85-9b2d-7c0c813c3a6c') and (ItemName eq 'Task')
       //.then( docs => this.getDocuments(docs) )
  }

  getDocuments(docs) : void {
     this.Docs = docs.map( (item, i , arr) => {
        item.TimeCreted = new Date(item.TimeCreated);
        console.log(new Date(item.TimeCreated));
        item.icon = item.Name.substring(item.Name.lastIndexOf('.')+1,item.Name.length);
     });
     console.log(this.Docs);
  }

}
