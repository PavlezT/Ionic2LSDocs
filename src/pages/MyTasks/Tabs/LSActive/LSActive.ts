import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'LSActive',
  templateUrl: 'LSActive.html'
})
export class LSActive {
   tabOne : any;
   chatParams : any;

  constructor(public navCtrl: NavController) {
     this.chatParams = {'d':'bb'};
  }

}
