import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

@Component({
   selector: 'infotab',
   templateUrl: 'InfoTab.html'
})
export class InfoTab {
  id :number;
  listGUID: string;
  ContentTypeId: string;

  itemProps : Object;

  constructor( public navCtrl: NavController, public navParams: NavParams) {
      // this.id = navCtrl.parent.itemid;
      // this.listGUID = navCtrl.parent.listGUID;
      // this.ContentTypeId = navParams.data.item.ContentTypeId;
      console.log('info tab :navCtrl ', navCtrl);
      console.log("InfoTab: Passed params", navParams);

      this.getItemProps();
  }

  getItemProps(){
    //get request  /Items(76)/FieldValuesAsText

    this.itemProps = {
      'Signature':'Ltest',
      'KindOfAnnex': 'LY',
      'UploadingStatus': 'Not uploaded'
    }
  }

  keys() : Array<string> {
    return Object.keys(this.itemProps);
  }

}
