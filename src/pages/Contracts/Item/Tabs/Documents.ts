import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

@Component({
   selector: 'documents',
   templateUrl: 'Documents.html'
})
export class Documents {

  Docs : Array<{Name : string ,TimeCreated : string}>;

  constructor(public navCtrl: NavController, public navParams: NavParams) {

      console.log("Passed params", navParams.data);
      this.getDocuments();
  }

  getDocuments() : void { //Items(id)/Folder/Files
    
    this.Docs =  [{'Name':'d',TimeCreated:'now' },{'Name':'d2',TimeCreated: 'now'}]
  }

}
