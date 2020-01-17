import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyWellnessWalletPage } from './my-wellness-wallet';

@NgModule({
  declarations: [
    MyWellnessWalletPage,
  ],
  imports: [
    IonicPageModule.forChild(MyWellnessWalletPage),
  ],
})
export class MyWellnessWalletPageModule {}
