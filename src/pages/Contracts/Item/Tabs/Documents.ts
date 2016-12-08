import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

@Component({
   selector: 'documents',
   templateUrl: 'Documents.html'
})
export class Documents {

  constructor(public navCtrl: NavController, public navParams: NavParams) {

      console.log("Passed params", navParams.data);
  }

}
