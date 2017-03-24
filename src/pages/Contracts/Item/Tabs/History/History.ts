import { Component, Inject,  ViewChild } from '@angular/core';
import { NavController, NavParams,Events, Slides } from 'ionic-angular';
import { SelectedItem } from '../../../../../utils/selecteditem';
import { ArraySortPipe } from '../../../../../utils/arraySort';
import * as consts from '../../../../../utils/Consts';

@Component({
   selector: 'history',
   providers: [ArraySortPipe],
   templateUrl: 'History.html'
})
export class History {

  history :any;
  taskHistory: Array<any>;

  @ViewChild('mySlider') slider: Slides;

  constructor(public navCtrl: NavController, public navParams: NavParams,public events: Events, @Inject(SelectedItem) public selectedItem : SelectedItem) {
      selectedItem.getItemHistory()
       .then( history => this.getHistory(history) )
  }

  ionViewDidLoad(){
        let self = this;
        this.slider.ionDrag.delay(consts.swipeDelay).subscribe(
           data=>{
               if(data.swipeDirection == "prev")
                    self.events.publish('itemslide:change',1);
               else if (data.swipeDirection == "next")
                    self.events.publish('itemslide:change',3);
            },
           error=>{console.log('ion drag error',error)},
           ()=>{console.log('ion complete ionDrag',)}
       )
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
