import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

@Component({
   selector: 'infotab',
   templateUrl: 'InfoTab.html'
})
export class InfoTab {

  constructor(public navCtrl: NavController, public navParams: NavParams) {

      console.log("Passed params", navParams.data);
  }

}
