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
      
      selectedItem.getItemProps()
         .then( itemProps => this.getItemProps(itemProps));
  }

  getItemProps(itemProps){
     let keys = this.keys(itemProps);
     let props = {};
     keys.map( (key, i ,arr) =>{
        if(itemProps[key] && !key.includes('_'))
            props[key] = itemProps[key];
     })

     this.itemProps = props;
     this.itemKeys = this.keys(this.itemProps);

  }

  keys(obj) : Array<string> {
     return Object.keys(obj);
  }

}
