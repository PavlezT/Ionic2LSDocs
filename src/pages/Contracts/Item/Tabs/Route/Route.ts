import { Component, Inject, ViewChild } from '@angular/core';
import { NavController, NavParams,Events, Slides } from 'ionic-angular';
import { SelectedItem } from '../../../../../utils/selecteditem';
import { Localization } from '../../../../../utils/localization';
import * as consts from '../../../../../utils/Consts';
import * as moment from 'moment';
import 'moment/locale/uk';

@Component({
   selector: 'route',
   templateUrl: 'Route.html'
})
export class Route {
  @ViewChild('mySlider') slider: Slides;
  routesList : Array<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams,  public events: Events, @Inject(Localization) public loc : Localization, @Inject(SelectedItem) public selectedItem : SelectedItem) {
      moment.locale(this.loc.localization);
      selectedItem.getItemRoutes()
       .then( routes => this.getRoutes(routes) )
  }

  ionViewDidLoad(){
        let self = this;
        this.slider.ionDrag.delay(consts.swipeDelay).subscribe(
           data=>{
               if(data.swipeDirection == "prev")
                    self.events.publish('itemslide:change',2);
            },
           error=>{console.log('ion drag error',error)},
           ()=>{console.log('ion complete ionDrag',)}
       )
   }

  getRoutes(routes) : void {
     this.routesList = routes.map( item => {
       item.StartDate = item.StartDate? moment(item.StartDate).format(`DD.MM.YYYY [${this.loc.dic.Alert42}] HH:mm`) : null;
       item.EndDate = item.EndDate? moment(item.EndDate).format(`DD.MM.YYYY [${this.loc.dic.Alert42}] HH:mm`) : null;
       return item;
     })
  }

}
