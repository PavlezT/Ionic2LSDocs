import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';

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
import { Delegate } from '../pages/MyTasks/TaskItem/Delegate/Delegate';
//import { SuperTabsModule } from 'ionic2-super-tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Network } from '@ionic-native/network';
import { NativeStorage } from '@ionic-native/native-storage';
import { File } from '@ionic-native/file';
import { Device } from '@ionic-native/device';
import { Transfer } from '@ionic-native/transfer';
import { FileOpener } from '@ionic-native/file-opener';
import { FilePath } from '@ionic-native/file-path';
import { Badge } from '@ionic-native/badge';

@NgModule({
  declarations: [
    MyApp,
    MyTasks,
    Contracts,
    Item, TaskItem,Delegate,
    InfoTab, Documents, History, Route, ArraySortPipe,
    LSNew , LSActive ,LSLate , LSEnded
  ],
  imports: [
    HttpModule,
    BrowserModule,
    IonicModule.forRoot(MyApp)
    //,SuperTabsModule.forRoot()
    // ,TranslateModule.forRoot()
    ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MyTasks,
    Contracts,
    Item, TaskItem, Delegate,
    InfoTab, Documents, History, Route,
    LSNew , LSActive ,LSLate , LSEnded
  ],
  providers: [
      StatusBar,FileOpener,FilePath,Badge,
      SplashScreen,Network,NativeStorage,File,Device,Transfer,
      {provide: ErrorHandler, useClass: IonicErrorHandler},
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
