import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { MyTasks } from '../pages/MyTasks/MyTasks';
import { Contracts } from '../pages/Contracts/Contracts';
import { Item } from '../pages/Contracts/Item/Item';
import { InfoTab } from '../pages/Contracts/Item/Tabs/InfoTab';
import { Documents } from '../pages/Contracts/Item/Tabs/Documents';
import { Auth } from '../utils/auth';
import { SelectedItem } from '../utils/selecteditem';

@NgModule({
  declarations: [
    MyApp,
    MyTasks,
    Contracts,
    Item,
    InfoTab,
    Documents
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
    Documents
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler},
      {provide: Auth , useClass: Auth},
      {provide: SelectedItem , useClass: SelectedItem}
   ]
})
export class AppModule {}
