import { Component , Inject , NgZone} from '@angular/core';
import { Item } from './Item/Item';
import { NavController, NavParams } from 'ionic-angular';
import { Http, Headers, RequestOptions  } from '@angular/http';

import * as consts from '../../utils/Consts';
import { SelectedItem } from '../../utils/selecteditem';

@Component({
  selector: 'contracts',
  templateUrl: 'Contracts.html'
})
export class Contracts {
  items: Array<any>;//{title: string, note: string}
  listTitle: string;
  guid: string;

  constructor(public navCtrl: NavController , public navParams: NavParams , @Inject(Http) public http: Http ,  @Inject(SelectedItem) public selectedItem : SelectedItem, private zone:NgZone ) {
    this.listTitle = navParams.data.title;
    this.guid = navParams.data.guid;

    this.getItems()
      .then( res => {
         this.items = res.json().d.results.filter( item => {
            return item.Title ? item : null;
         });
      })
      .catch( error => {
        console.error(`Error in getItems from ${this.listTitle}`,error);
        this.items = [];
      })
  }

  itemTapped(event, item) {
    this.selectedItem.set(item,this.guid);
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

  searchItem(event :any){
      this.getItems()
         .then( (res) => {
            res = res.json().d.results;
            let val = event.target.value;

            if (val && val.trim() != '') {
               //this.zone.run(()=>{
                  this.items = res.filter((item) => {
                    return (item.Title && item.Title.toLowerCase().includes(val.toLowerCase())) ? item : null;
                 })
            //   })
            }
         })
  }
}
