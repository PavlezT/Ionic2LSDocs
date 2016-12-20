import { Component , Inject } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SelectedItem } from '../../../../../utils/selecteditem';

@Component({
   selector: 'infotab',
   templateUrl: 'InfoTab.html'
})
export class InfoTab {
  id :number;
  listGUID: string;
  ContentTypeId: string;

  itemProps : any;
  itemKeys : Array<string>;

  constructor( public navCtrl: NavController, public navParams: NavParams , @Inject(SelectedItem) public selectedItem : SelectedItem ) {
      this.id  = selectedItem.getId();
      this.listGUID = selectedItem.getListGUID();
      
      Promise.all([selectedItem.getItemFileds(),selectedItem.getItemProps()])
         .then( (res) => this.getItemProps(res[0],res[1]));
  }

  getItemProps(ItemFields,itemProps){
     let keys = ItemFields;//this.keys(itemFields);
     let props = {};
     keys.map( (key, i ,arr) => {
        if(itemProps[key.StaticName] && !key.StaticName.includes('_'))
            props[key.StaticName] = itemProps[key.StaticName];
     })

     this.itemProps = props;
     this.itemKeys = ItemFields;
  }

  // keys(obj) : Array<string> {
  //    return Object.keys(obj);
  // }

}
