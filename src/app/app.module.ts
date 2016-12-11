import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { MyTasks } from '../pages/MyTasks/MyTasks';
import { Contracts } from '../pages/Contracts/Contracts';
import { Item } from '../pages/Contracts/Item/Item';
import { InfoTab } from '../pages/Contracts/Item/Tabs/InfoTab/InfoTab';
import { Documents } from '../pages/Contracts/Item/Tabs/Documents/Documents';
import { Auth } from '../utils/auth';
import { SelectedItem } from '../utils/selecteditem';
import { LSNew } from '../pages/MyTasks/Tabs/LSNew/LSNew';
import { LSActive } from '../pages/MyTasks/Tabs/LSActive/LSActive';
import { LSLate } from '../pages/MyTasks/Tabs/LSLate/LSLate';
import { LSEnded } from '../pages/MyTasks/Tabs/LSEnded/LSEnded';

@NgModule({
  declarations: [
    MyApp,
    MyTasks,
    Contracts,
    Item,
    InfoTab,
    Documents,
    LSNew , LSActive ,LSLate , LSEnded
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MyTasks,
    Contracts,
    Item,
    InfoTab,
    Documents,
    LSNew , LSActive ,LSLate , LSEnded
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler},
      {provide: Auth , useClass: Auth},
      {provide: SelectedItem , useClass: SelectedItem}
   ]
})
export class AppModule {}
