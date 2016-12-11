import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { LSNew } from './Tabs/LSNew/LSNew';
import { LSActive } from './Tabs/LSActive/LSActive';
import { LSLate } from './Tabs/LSLate/LSLate';
import { LSEnded } from './Tabs/LSEnded/LSEnded';

@Component({
  selector: 'MyTasks',
  templateUrl: 'MyTasks.html'
})
export class MyTasks {
   tabNew : any;
   tabActive : any;
   tabLate : any;
   tabEnded : any;
   
   chatParams : any;

  constructor(public navCtrl: NavController) {
     this.tabNew =  LSNew;
     this.tabActive = LSActive;
     this.tabLate = LSLate;
     this.tabEnded = LSEnded;

     this.chatParams = {'d':'bb'};
  }

}
