import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

// import { File } from '@ionic-native/file';
// import { Camera } from '@ionic-native/camera';

import { ProfilePage } from './profile';
import { MultiPickerModule } from 'ion-multi-picker';

@NgModule({
  declarations: [
    ProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(ProfilePage),
    MultiPickerModule
  ],
  providers:[
    //Camera
  ]
})
export class ProfilePageModule {}
