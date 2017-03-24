import { Component, ViewChild } from '@angular/core'; //, Inject
import { NavController, NavParams, Events, ViewController, Platform,Tabs,MenuController } from 'ionic-angular';

import { InfoTab } from './Tabs/InfoTab/InfoTab';
import { Documents } from './Tabs/Documents/Documents';
import { History } from './Tabs/History/History';
import { Route } from './Tabs/Route/Route';

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
  history : any;
  routes : any;

  @ViewChild('myTabs') tabRef: Tabs;

  constructor(public navCtrl: NavController, public navParams: NavParams,public menuCtrl: MenuController, public events: Events, public platform: Platform, public viewCtrl: ViewController) {
    this.title = navParams.data.item.Title || '---';
    this.id = navParams.data.item.Id;
    this.listGUID = navParams.data.listGUID;
    this.ContentTypeId = navParams.data.item.ContentTypeId || '0x0';

    this.infoTab = InfoTab;
    this.documents = Documents;
    this.history = History;
    this.routes = Route;

    events.subscribe('itemslide:change',(tab : number)=>{
          this.tabRef.select(tab[0]);
    });
    events.subscribe('itemsmenu:open',()=>{
      menuCtrl.open();
    });
  }

  ionViewDidEnter(){
    this.platform.registerBackButtonAction((e)=>{this.dismiss();return false;},100);
  }

  dismiss(){
     this.viewCtrl.dismiss();
  }

}
