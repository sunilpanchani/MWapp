import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';


import { NotificationPage } from './notification';

@NgModule({
  declarations: [
    NotificationPage,
  ],
  imports: [
    IonicPageModule.forChild(NotificationPage)
  ],
  providers:[
    //Camera
  ]
})
export class NotificationPageModule {}
