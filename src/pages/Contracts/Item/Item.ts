import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { InfoTab } from './Tabs/InfoTab'
import { Documents } from './Tabs/Documents'

@Component({
   selector: 'item',
   templateUrl: 'Item.html'
})
export class Item {
  title : string;
  id : number;
  ContentTypeId : string;
  listGUID: string;

  infoTab : any ;
  documents: any;
  selectedItem: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.title = navParams.data.item.Title;
    this.id = navParams.data.item.Id;
    this.listGUID = navParams.data.listGUID;
    this.ContentTypeId = navParams.data.item.ContentTypeId;

    this.infoTab = InfoTab;
    this.documents = Documents;
  }

}
