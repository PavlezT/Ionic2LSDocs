import { Component } from '@angular/core';
import { Item } from './Item/Item';
import { NavController, NavParams } from 'ionic-angular';
import { Http, Headers, RequestOptions  } from '@angular/http';

import * as consts from '../../app/Consts';

@Component({
  selector: 'contracts',
  templateUrl: 'Contracts.html'
})
export class Contracts {
  selectedItem: any;
  items: Array<any>;//{title: string, note: string}
  listTitle: string;
  guid: string;

  constructor(public navCtrl: NavController , public navParams: NavParams , public http: Http ) {
    this.items = [];
    this.listTitle = navParams.data.title;
    this.guid = navParams.data.guid;

    this.getItems()
      .then( res => {
         this.items = res.json().d.results;
         // res.json().d.results.map((item,i,mass) => {
         //    if(item.ListTitle)
         //       this.items.push({ id:title: item.ListTitle , icon:"folder", component: Contracts , listGUID : item.ListGUID})
         // })
      })
  }

  itemTapped(event, item) {
    this.navCtrl.push(Item, {
      item: item
    });
  }

  getItems(): Promise <any> {
     let listGet = `${consts.siteUrl}/_api/Web/Lists('${this.guid}')/Items?$select=Id,Title,ContentTypeId,Created,Modified`;

     let headers = new Headers({'Accept': 'application/json;odata=verbose'});
     let options = new RequestOptions({ headers: headers });

     return this.http.get(listGet,options).toPromise()
  }
}
