import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IntroVideoPage } from './intro-video';

@NgModule({
  declarations: [
    IntroVideoPage,
  ],
  imports: [
    IonicPageModule.forChild(IntroVideoPage),
  ],
})
export class IntroVideoPageModule {}
