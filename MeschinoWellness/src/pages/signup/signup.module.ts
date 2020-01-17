import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { MultiPickerModule } from 'ion-multi-picker';

import { SignupPage } from './signup';

@NgModule({
  declarations: [
    SignupPage,
  ],
  imports: [
    IonicPageModule.forChild(SignupPage),
    TranslateModule.forChild(),
    MultiPickerModule
  ],
  exports: [
    SignupPage
  ]
})
export class SignupPageModule {

 
 }
