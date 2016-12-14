import { Component, Inject } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SelectedItem } from '../../../../../utils/selecteditem';
//import { ArraySortPipe } from '../../../../../utils/arraySort';

@Component({
   selector: 'route',
   //providers: [ArraySortPipe],
   templateUrl: 'Route.html'
})
export class Route {

  routeList : Array<any>;
  taskHistory: Array<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams, @Inject(SelectedItem) public selectedItem : SelectedItem) {

      selectedItem.getItemRoutes()
       .then( routes => this.getRoutes(routes) )
  }

  getRoutes(history) : void {
     console.log('routes',history);
   //   this.historyList = history.map( (item, i , arr) => {
   //      this.taskHistory = JSON.parse(item.TaskHistory);
   //      this.taskHistory.map( task => {
   //        task.EvanteDate = task.EvanteDate.substring(0,10).split('.').reverse().join('-') + task.EvanteDate.substring(10,task.EvanteDate.length);
     //
   //        return task;
   //      });
   //      return item;
   //   });
  }

}
