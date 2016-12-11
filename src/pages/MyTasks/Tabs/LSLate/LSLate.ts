import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'LSLate',
  templateUrl: 'LSLate.html'
})
export class LSLate {
   tabOne : any;
   chatParams : any;

  constructor(public navCtrl: NavController) {
     this.chatParams = {'d':'bb'};
  }

}
