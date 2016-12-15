import { Component, Inject } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SelectedItem } from '../../../../../utils/selecteditem';
import * as moment from 'moment';
import 'moment/locale/pt-br';

@Component({
   selector: 'route',
   templateUrl: 'Route.html'
})
export class Route {

  routesList : Array<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams, @Inject(SelectedItem) public selectedItem : SelectedItem) {
      moment.locale('ru');
      selectedItem.getItemRoutes()
       .then( routes => this.getRoutes(routes) )
  }

  getRoutes(routes) : void {
     this.routesList = routes.map( item =>{
       console.log('routes',item)
       item.StartDate = item.StartDate? moment(item.StartDate).format('DD.MM.YYYY в HH:mm') : null;
       item.EndDate = item.EndDate? moment(item.EndDate).format('DD.MM.YYYY в HH:mm') : null;
       return item;
     })
     //StateStatus:Completed
     //StateStatus:InProgress
  }

}
