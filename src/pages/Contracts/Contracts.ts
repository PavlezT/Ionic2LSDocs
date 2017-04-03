import { Component , Inject , NgZone} from '@angular/core';
import { Item } from './Item/Item';
import { NavController, NavParams, MenuController } from 'ionic-angular';
import { Http, Headers, RequestOptions  } from '@angular/http';

import * as consts from '../../utils/Consts';
import { SelectedItem } from '../../utils/selecteditem';
import { Localization } from '../../utils/localization';

@Component({
  selector: 'contracts',
  templateUrl: 'Contracts.html'
})
export class Contracts {
  items: Array<any>;//{title: string, note: string}
  listTitle: string;
  guid: string;

  constructor(public navCtrl: NavController , public navParams: NavParams , private zone:NgZone,public menuCtrl: MenuController, @Inject(Http) public http: Http , @Inject(Localization) public loc : Localization, @Inject(SelectedItem) public selectedItem : SelectedItem ) {
    this.listTitle = navParams.data.title;
    this.guid = navParams.data.guid;

    this.getItems();
  }

  itemTapped(event, item) {
    this.selectedItem.set(item,this.guid);
    this.navCtrl.push(Item, {
      item: item,
      listGUID : this.guid
    });
  }

  getItems(loadNew? : boolean, search ? : string): Promise <any> {
     let lastId = this.items && loadNew ? this.items[this.items.length-1].Id : false;
     let listGet = `${consts.siteUrl}/_api/Web/Lists('${this.guid}')/Items?${ lastId ? '$skiptoken=Paged=TRUE=p_SortBehavior=0=p_ID='+lastId+'&' : ''}$select=Id,Title,ContentTypeId,Created,Modified&$top=25&$orderby=Id desc`+(search?`&$filter=substringof('${search}',Title)`:'');

     let headers = new Headers({'Accept': 'application/json;odata=verbose','Authorization':`Basic ${btoa(window.localStorage.getItem('username')+':'+window.localStorage.getItem('password'))}`});
     let options = new RequestOptions({ headers: headers });

     return this.http.get(listGet,options).timeout(consts.timeoutDelay).retry(consts.retryCount).toPromise()
        .then( res => {
            if(!loadNew)this.items=[];
            res.json().d.results.map( item => {
                item.Created = item.Created? (new Date(item.Created).toLocaleString()) : null;
                item.Modified = item.Modified? (new Date(item.Modified).toLocaleString()) : null;
                item.Title && this.items.push(item);
            });
          })
        .catch( error => {
            console.error(`<Contracts> Error in getItems from ${this.listTitle}`,error);
            this.items = [];
        })
  }

  searchItem(event :any){
      this.getItems(false,event.target.value)
  }

  doInfinite(infiniteScroll){
    this.getItems(true)
      .then( () =>{
        infiniteScroll.complete();
      })
  }

  public swiped(event){
    if(event.direction == 4)
      this.menuCtrl.open();
  }
}
