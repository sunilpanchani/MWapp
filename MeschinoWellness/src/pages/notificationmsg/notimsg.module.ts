import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotificationMsgPage } from './notimsg';


@NgModule({
  declarations: [
    NotificationMsgPage,
  ],
  imports: [
    IonicPageModule.forChild(NotificationMsgPage)
  ],
  providers:[
  ]
})
export class NotificationMsgPageModule {}
