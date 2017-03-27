import { Component , Inject, ViewChild } from '@angular/core';
import { NavController, NavParams,Events, Slides  } from 'ionic-angular';
import { SelectedItem } from '../../../../../utils/selecteditem';

@Component({
   selector: 'infotab',
   templateUrl: 'InfoTab.html'
})
export class InfoTab {
  id :number;
  listGUID: string;
  ContentTypeId: string;

  itemProps : any;
  itemKeys : Array<string>;

  @ViewChild('mySlider') slider: Slides;

  constructor( public navCtrl: NavController, public navParams: NavParams ,public events: Events, @Inject(SelectedItem) public selectedItem : SelectedItem ) {
      this.id  = selectedItem.getId();
      this.listGUID = selectedItem.getListGUID();
      
      Promise.all([selectedItem.getItemFileds(),selectedItem.getItemProps()])
         .then( (res) => this.getItemProps(res[0],res[1]));
  }

  ionViewDidLoad(){
        let self = this;
        this.slider.ionDrag.delay(100).subscribe(
           data=>{
               if(data.swipeDirection == "prev")
                    self.events.publish('itemsmenu:open');
               else if (data.swipeDirection == "next")
                    self.events.publish('itemslide:change',1);
            },
           error=>{console.log('ion drag error',error)},
           ()=>{console.log('ion complete ionDrag',)}
       )
   }

  getItemProps(ItemFields,itemProps){
     this.itemKeys = ItemFields.filter( (key, i ,arr) => {
        if( itemProps[key.StaticName] && !key.StaticName.includes('_') && !key.Group.toLowerCase().includes('hidden'))
            return key;
     })
     this.itemProps = itemProps;
  }

}
