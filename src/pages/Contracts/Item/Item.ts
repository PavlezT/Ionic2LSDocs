import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { InfoTab } from './Tabs/InfoTab'
import { Documents } from './Tabs/Documents'

@Component({
   selector: 'item',
   templateUrl: 'Item.html'
})
export class Item {
  infoTab :any;
  documents:any;
  selectedItem: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.infoTab = InfoTab;
    this.documents = Documents;
    this.selectedItem = navParams.get('item');
  }
}
