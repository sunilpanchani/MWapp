import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyHraPage } from './my-hra';

@NgModule({
  declarations: [
    MyHraPage,
  ],
  imports: [
    IonicPageModule.forChild(MyHraPage),
  ],
})
export class MyHraPageModule {}
