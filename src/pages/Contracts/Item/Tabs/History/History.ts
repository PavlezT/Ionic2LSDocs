import { Component, Inject } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SelectedItem } from '../../../../../utils/selecteditem';
import { ArraySortPipe } from '../../../../../utils/arraySort';

@Component({
   selector: 'history',
   providers: [ArraySortPipe],
   templateUrl: 'History.html'
})
export class History {

  history :any;
  taskHistory: Array<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams, @Inject(SelectedItem) public selectedItem : SelectedItem) {
      selectedItem.getItemHistory()
       .then( history => this.getHistory(history) )
  }

  getHistory(history) : void {
    this.history = history[0] || {};
    if(this.history && this.history.propertyIsEnumerable('TaskHistory') ){
      this.taskHistory = JSON.parse(this.history.TaskHistory).map( task => {
        task.EvanteDate = task.EvanteDate.substring(0,10).split('.').reverse().join('-') + task.EvanteDate.substring(10,task.EvanteDate.length);
        return task;
      })
    }
  }

}
