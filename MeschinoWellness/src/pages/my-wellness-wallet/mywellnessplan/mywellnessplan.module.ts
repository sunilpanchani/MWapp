import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyWellnessPlanPage } from './mywellnessplan';

@NgModule({
  declarations: [
    MyWellnessPlanPage,
  ],
  imports: [
    IonicPageModule.forChild(MyWellnessPlanPage),
  ],
})
export class MyWellnessPlanPageModule {}
