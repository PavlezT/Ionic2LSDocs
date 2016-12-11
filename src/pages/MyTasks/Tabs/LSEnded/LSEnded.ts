import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'LSEnded',
  templateUrl: 'LSEnded.html'
})
export class LSEnded {
   tabOne : any;
   chatParams : any;

  constructor(public navCtrl: NavController) {
     this.chatParams = {'d':'bb'};
  }

}
