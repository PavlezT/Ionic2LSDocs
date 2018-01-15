import { Component, Inject,  ViewChild } from '@angular/core';
import { NavController, NavParams,Events, Slides } from 'ionic-angular';
import { SelectedItem } from '../../../../../utils/selecteditem';
import { ArraySortPipe } from '../../../../../utils/arraySort';
// import * as consts from '../../../../../utils/consts';
import { Localization } from '../../../../../utils/localization';

@Component({
   selector: 'history',
   providers: [ArraySortPipe],
   templateUrl: 'History.html'
})
export class History {

  history :any;
  taskHistory: Array<any>;

  @ViewChild('mySlider') slider: Slides;

  constructor(public navCtrl: NavController, public navParams: NavParams,public events: Events, @Inject(Localization) public loc : Localization, @Inject(SelectedItem) public selectedItem : SelectedItem) {
      selectedItem.getItemHistory()
       .then( history => this.getHistory(history) )
  }

  ionViewDidLoad(){
        // let self = this;
      //   this.slider.ionDrag.delay(consts.swipeDelay).subscribe(
      //      data=>{
      //          if(data.swipeDirection == "prev")
      //               self.events.publish('itemslide:change',1);
      //          else if (data.swipeDirection == "next")
      //               self.events.publish('itemslide:change',3);
      //       },
      //      error=>{console.log('ion drag error',error)},
      //      ()=>{console.log('ion complete ionDrag',)}
      //  )
   }

  getHistory(history) : void {
    this.history = history[0] || {};
    if(this.history && this.history.propertyIsEnumerable('TaskHistory') ){
      this.taskHistory = JSON.parse(this.history.TaskHistory).map( task => {
        task.EvanteDate = task.EvanteDate.substring(0,10).split('.').reverse().join('-') + task.EvanteDate.substring(10,task.EvanteDate.length);
        task.EventTitle = History.prototype.getEventTitle.call(this,task.EventType);
        
        return task;
      })
    }
  }

  private getEventTitle(EventType : string) : string {
    let title;

    switch(EventType){
      case 'EventCreateTask':
        title = this.loc.dic.Alert57;
        break; 
      case 'EventCreateTask EventAddTask':
        title = this.loc.dic.Alert68;
        break; 
      case 'EventDelegateTask':
        title = this.loc.dic.Alert67;
        break; 
      case 'EventDoneTask':
        title = this.loc.dic.Alert60;
        break; 
      case 'EventDoneTask EventAddTask':
        title = this.loc.dic.Alert60;
        break; 
      case 'EventBackTask':
        title = this.loc.dic.Alert66;
        break; 
      case 'EventAutoCloseTask':
        title = this.loc.dic.Alert58;
        break; 
      case 'EventInWorkTask':
        title = this.loc.dic.Alert59;
        break; 
      case 'EventRejectRoute':
        title = this.loc.dic.EventType6;
        break;
      case 'EventReassignTask':
        title = this.loc.dic.Alert105;
        break;
      default :
        title = ' ';
    }

    return title;
  }

}
