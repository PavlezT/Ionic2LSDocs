import { Component , Inject} from '@angular/core';
import { Item } from './Item/Item';
import { NavController, NavParams } from 'ionic-angular';
import { Http, Headers, RequestOptions  } from '@angular/http';

import * as consts from '../../utils/Consts';
import { Auth } from '../../utils/auth';
import { SelectedItem } from '../../utils/selecteditem';

@Component({
  selector: 'contracts',
  templateUrl: 'Contracts.html'
})
export class Contracts {
  selectedItem: any;
  items: Array<any>;//{title: string, note: string}
  listTitle: string;
  guid: string;

  constructor(public navCtrl: NavController , public navParams: NavParams , public http: Http , @Inject(SelectedItem) public selectItem  ) {
    this.items = [];
    this.listTitle = navParams.data.title;
    this.guid = navParams.data.guid;

    this.getItems()
      .then( res => {
         this.items = res.json().d.results;
      })
      .catch( error => {
        console.error(`Error in getItems from ${this.listTitle}`,error);
      })
  }

  itemTapped(event, item) {
    this.navCtrl.push(Item, {
      item: item,
      listGUID : this.guid
    });
  }

  getItems(): Promise <any> {
     let listGet = `${consts.siteUrl}/_api/Web/Lists('${this.guid}')/Items?$select=Id,Title,ContentTypeId,Created,Modified&$top=25&$orderby=Id desc`;

     let headers = new Headers({'Accept': 'application/json;odata=verbose'});
     let options = new RequestOptions({ headers: headers });

     return this.http.get(listGet,options).toPromise()
  }
}
