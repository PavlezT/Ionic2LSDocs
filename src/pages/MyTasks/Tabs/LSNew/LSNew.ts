import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'LSNew',
  templateUrl: 'LSNew.html'
})
export class LSNew {
   tabOne : any;
   chatParams : any;

  constructor(public navCtrl: NavController) {

     this.chatParams = {'d':'bb'};
  }

}
