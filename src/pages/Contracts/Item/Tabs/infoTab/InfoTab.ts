import { Component , Inject, ViewChild } from '@angular/core';
import { NavController, NavParams,Events, Slides  } from 'ionic-angular';
import { SelectedItem } from '../../../../../utils/selecteditem';
import { Localization } from '../../../../../utils/localization';

@Component({
   selector: 'infotab',
   templateUrl: 'InfoTab.html'
})
export class InfoTab {
  id :number;
  listGUID: string;
  ContentTypeId: string;
  Except : Object;

  itemProps : any;
  itemKeys : Array<string>;

  @ViewChild('mySlider') slider: Slides;

  constructor( public navCtrl: NavController, public navParams: NavParams ,public events: Events,  @Inject(Localization) public loc : Localization,@Inject(SelectedItem) public selectedItem : SelectedItem ) {
      this.id  = selectedItem.getId();
      this.listGUID = selectedItem.getListGUID();

      this.Except = {
          'FileLeafRef' : true,
          'Title' : true,
          'FolderChildCount' : true,
          'ItemChildCount' : true,
          'TaxCatchAll' : true,
          'TaxCatchAllLabel' : true,
          '_dlc_DocIdPersistId' : true,
          '_dlc_DocIdUrl' : true,
          '_dlc_DocId' : true,
          'LSiIdeaMetaCategory_0' : true,
          'OrderType_0': true ,
          'IntDocType_0' : true,
          'Source_0' : true,
          'RequestType_0' : true,
          'ContractType_0' : true,
      }
      
      Promise.all([selectedItem.getItemFileds(),selectedItem.getItemProps()])
         .then( (res) => this.getItemProps(res[0],res[1]));
  }

  ionViewDidLoad(){
        // let self = this;
    //     this.slider.ionDrag.delay(100).subscribe(
    //        data=>{
    //            if(data.swipeDirection == "prev")
    //                 self.events.publish('itemsmenu:open');
    //            else if (data.swipeDirection == "next")
    //                 self.events.publish('itemslide:change',1);
    //         },
    //        error=>{console.log('ion drag error',error)},
    //        ()=>{console.log('ion complete ionDrag',)}
    //    )
   }

  getItemProps(ItemFields,itemProps){
     this.itemKeys = ItemFields.filter( (key, i ,arr) => {
        if( itemProps[key.StaticName] && !key.StaticName.includes('_') && !key.Group.toLowerCase().includes('hidden') && !this.Except[key.StaticName] && !this.Except[key.Title])
            return key;
     })
     this.itemProps = itemProps;
  }

}
