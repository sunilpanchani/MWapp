import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyTrackerPage } from './mytracker';

@NgModule({
  declarations: [
    MyTrackerPage,
  ],
  imports: [
    IonicPageModule.forChild(MyTrackerPage),
  ],
})
export class MyTrackerPageModule {}
