import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { MyTasks } from '../pages/MyTasks/MyTasks';
import { Contracts } from '../pages/Contracts/Contracts';
import { Item } from '../pages/Contracts/Item/Item';
import { InfoTab } from '../pages/Contracts/Item/Tabs/InfoTab/InfoTab';
import { Documents } from '../pages/Contracts/Item/Tabs/Documents/Documents';
import { History  } from '../pages/Contracts/Item/Tabs/History/History';
import { Route } from '../pages/Contracts/Item/Tabs/Route/Route';
import { Auth } from '../utils/auth';
import { Access } from '../utils/access';
import { SelectedItem } from '../utils/selecteditem';
import { Loader } from '../utils/loader';
import { Images } from '../utils/images';
import { ArraySortPipe } from '../utils/arraySort';
import { User } from '../utils/user';
import { Localization } from '../utils/localization';
import { LSNew } from '../pages/MyTasks/Tabs/LSNew/LSNew';
import { LSActive } from '../pages/MyTasks/Tabs/LSActive/LSActive';
import { LSLate } from '../pages/MyTasks/Tabs/LSLate/LSLate';
import { LSEnded } from '../pages/MyTasks/Tabs/LSEnded/LSEnded';
import { TaskItem } from '../pages/MyTasks/TaskItem/TaskItem';

@NgModule({
  declarations: [
    MyApp,
    MyTasks,
    Contracts,
    Item, TaskItem,
    InfoTab, Documents, History, Route, ArraySortPipe,
    LSNew , LSActive ,LSLate , LSEnded
  ],
  imports: [
    IonicModule.forRoot(MyApp,{
      platforms:{
        ios:{
          // menuType:'overlay',
          statusbarPadding:true
        }
      }
    },{})
    // ,TranslateModule.forRoot()
    ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MyTasks,
    Contracts,
    Item, TaskItem,
    InfoTab, Documents, History, Route,
    LSNew , LSActive ,LSLate , LSEnded
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler},
      {provide: Auth , useClass: Auth},
      {provide: Access, useClass: Access},
      {provide: SelectedItem , useClass: SelectedItem},
      {provide: User , useClass: User},
      {provide: Loader, useClass: Loader},
      {provide: Images, useClass: Images},
      {provide: Localization, useClass: Localization}
   ]
})
export class AppModule {}
