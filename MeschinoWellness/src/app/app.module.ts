import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { WheelSelector } from '@ionic-native/wheel-selector';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { ReactiveFormsModule, NgForm } from '@angular/forms';

import { Items } from '../mocks/providers/items';
import { Settings, Api,  HraService, NotificationService, UserService } from '../providers';

import { MyApp } from './app.component';

import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { WelcomePageModule } from '../pages/welcome/welcome.module';
import { HraBodyPageModule } from '../pages/hra-body/hra-body.module';
import { HraQaPageModule } from '../pages/my-wellness-wallet/hra-qa/hra-qa.module';
import { MyHraPageModule } from '../pages/my-hra/my-hra.module';
import { IntroPageModule } from '../pages/intro/intro.module';
import { IntroVideoPageModule } from '../pages/intro-video/intro-video.module';
import { SignupPageModule } from '../pages/signup/signup.module';
import { LoginPageModule } from '../pages/login/login.module';
import { DashboardPageModule } from '../pages/dashboard/dashboard.module';
import { MyWellnessPlanPageModule } from '../pages/my-wellness-wallet/mywellnessplan/mywellnessplan.module';
import { HraResultPageModule } from '../pages/my-wellness-wallet/hra-result/hra-result.module';
import { MyWellnessWalletPageModule } from '../pages/my-wellness-wallet/my-wellness-wallet.module';
import { ProfilePageModule } from '../pages/my-profile/profile.module';
import { MyTrackerPageModule } from '../pages/my-trackers/mytracker.module';
import { RiskDetailPageModule } from '../pages/my-wellness-wallet/riskdetail/riskdetail.module';


import { Camera } from '@ionic-native/camera';

import { ForgetPageModule } from '../pages/forgetpassword/forgetpassword.module';
import { NotificationPageModule } from '../pages/notification/notification.module';
import { TemplatePageModule } from '../pages/templates/template.module';
import { NotificationMsgPageModule } from '../pages/notificationmsg/notimsg.module';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { FcmService } from '../providers/settings/fcm.service';
import { Firebase } from '@ionic-native/firebase';
import { AlertMessagesService } from '../providers/settings/alertmessage.service';

// The translate loader needs to know where to load i18n files
// in Ionic's static asset pipeline.
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


// const config = {
//   apiKey: "AIzaSyCm7w_4jwHl7PlmgUTYZrvw4FOFoZRVHhE",
//   authDomain: "meschinowellness-ff60f.firebaseapp.com",
//   databaseURL: "https://meschinowellness-ff60f.firebaseio.com",
//   projectId: "meschinowellness-ff60f",
//   storageBucket: "meschinowellness-ff60f.appspot.com",
//   messagingSenderId: "511777519229",
// };

 const config = {
   apiKey: "AIzaSyCxxXSgvooUrArq-9boQWd1bOabjuLQTZQ",
   authDomain: "meschinowellness-61e33.firebaseapp.com",
   databaseURL: "https://meschinowellness-61e33.firebaseio.com",
   projectId: "meschinowellness-61e33",
   storageBucket: "meschinowellness-61e33.appspot.com",
   messagingSenderId: "414018168893"
   
 };


//  appId: "1:414018168893:web:11a33e2116c614a104a254",
//   measurementId: "G-0HRV1R9WPD"
export function provideSettings(storage: Storage) {
  /**
   * The Settings provider takes a set of default settings for your app.
   *
   * You can add new settings options at any time. Once the settings are saved,
   * these values will not overwrite the saved values (this can be done manually if desired).
   */
  return;
  // return new Settings(storage, {
  //   option1: true,
  //   option2: 'Ionitron J. Framework',
  //   option3: '3',
  //   option4: 'Hello'
  // });
}

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    
    IntroPageModule,
    IntroVideoPageModule,
    SignupPageModule,
    LoginPageModule,
    WelcomePageModule,
    HraBodyPageModule,
    HraQaPageModule,
    MyHraPageModule,
    HraResultPageModule,
    
    RiskDetailPageModule,
    DashboardPageModule,
    MyWellnessPlanPageModule,
    MyWellnessWalletPageModule,
    ProfilePageModule,
    MyTrackerPageModule,
    ForgetPageModule,
    NotificationPageModule,
    NotificationMsgPageModule,
    TemplatePageModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    IonicModule.forRoot(MyApp,{
      mode:"md"
    }),
    IonicStorageModule.forRoot(),
    
    AngularFireModule.initializeApp(config),
    AngularFirestoreModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    Api,
    Items,
    HraService,
    NotificationService,
    UserService,
    Camera,
    SplashScreen,
    StatusBar,
    HttpClient,
    HttpClientModule,
    WheelSelector,
    Firebase,
    FcmService,
    AlertMessagesService,
    { provide: Settings, useFactory: provideSettings, deps: [Storage] },
    // Keep this to enable Ionic's runtime error handling during development
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    
    UniqueDeviceID,
    NgForm
  ]
})
export class AppModule { }
