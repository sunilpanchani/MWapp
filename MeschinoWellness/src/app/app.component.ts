import { Component, ViewChild } from "@angular/core";
import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";
import { TranslateService } from "@ngx-translate/core";
import { UniqueDeviceID } from "@ionic-native/unique-device-id";

import {
  Config,
  Nav,
  Platform,
  Events,
  ToastController,
  MenuController,
  AlertController
} from "ionic-angular";

import { UserService } from "../providers";
import { WelcomePage } from "../pages/welcome/welcome";
import { LoginPage } from "../pages/login/login";
import { FcmService } from "../providers/settings/fcm.service";
import { WellnessConstants } from "../providers/settings/wellnessconstant";
import { TemplatePage } from "../pages/templates/template";
//import { NotificationPage } from "../pages/notification/notification";

@Component({
  selector: "page-app-main",
  templateUrl: "app.component.html"
})
export class MyApp {
  account: any;
  rootPage = WelcomePage;
  //rootPage = MyHraPage;
  IshiddenLink: boolean = false;
  @ViewChild(Nav) nav: Nav;
  pages: any[] = [
    // { title: "Dashboard", component: "DashboardPage", manuIcon: "dashboard" },
    {
      title: "My Wellness Wallet",
      component: "MyWellnessWalletPage",
      manuIcon: "wallet"
    },
    //{ title: 'My Wellness Plan', component: 'MyWellnessPlanPage' , manuIcon: 'speedometer' },
    // {
    //   title: "My Trackers",
    //   component: "MyTrackerPage",
    //   manuIcon: "tracker"
    // },
    {
      title: "My Profile",
      component: "ProfilePage",
      manuIcon: "user"
    }
    // ,
    // { title: "Settings", component: "DashboardPage", manuIcon: "setting" }
    //{ title: 'My Tracker', component: 'WelcomePage', manuIcon: 'speedometer' },
  ];

  //
  user_name: string = "";
  rewardpoints: number = 0;
  profilepic: string = "assets/img/loader.gif";

  MainSiteUrl: string = WellnessConstants.App_Url;
  PortalURL = "";
  constructor(
    private translate: TranslateService,
    private platform: Platform,
    private config: Config,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    public events: Events,
    private fcmSrv: FcmService,
    private uniqueDeviceID: UniqueDeviceID,
    private userSrv: UserService,
    private toastController: ToastController,
    private menu: MenuController,
    private alertCtl : AlertController
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      platform.registerBackButtonAction(()=>{
        console.log('Exit')
        //this.platform.exitApp();
        this.ShowExitAppAlert();
      });
      platform.pause.subscribe(e => {
        this.userSrv._LogoutUser();
      });
      //this.statusBar.styleDefault();
      //this.splashScreen.hide();
      this.statusBar.styleLightContent();
      this.uniqueDeviceID
        .get()
        .then((uuid: any) => {
          //alert('deviceid : '+uuid);
          localStorage.setItem("remUUID", uuid);
          this.notificationSetup(uuid);
        })
        .catch((error: any) => alert(error));

       this.menu.enable(false);
    });
    this.initTranslate();
    events.subscribe("user:created", user => {
      if (
        localStorage.getItem("UserInfo") !== undefined &&
        localStorage.getItem("UserInfo") !== null &&
        localStorage.getItem("UserName") !== undefined &&
        localStorage.getItem("UserName") !== null
      ) {
        this.user_name = user.FirstName + " " + user.LastName;
        this.rewardpoints = user.RewardPoint;
        this.profilepic = user.ProfileImage;
        //this.events.publish('user:created', user);
        //let userId = localStorage.getItem("UserName");
        if (
          localStorage.getItem("UserAccessLevel") !== null &&
          localStorage.getItem("UserAccessLevel") !== "Full"
        ) {
          this.IshiddenLink = true;
        } else {
          this.IshiddenLink = false;
        }
      }
    });
    // code for load push message
    // this.LoadNotifications();
    // this.presentToast("Hello I am alert");
  }

  ShowExitAppAlert() {
    this.alertCtl.create({
        title: 'Meschino Wellness',
        message: 'Are you sure you want to exit app?',
        enableBackdropDismiss: false,
        cssClass: "action-sheets-basic-page",
        buttons: [
            {
                text: 'Yes',
                handler: () => {
                    //this.isExitAlertOpen = false;
                    this.userSrv._LogoutUser();
                    this.platform.exitApp();
                }
            }, {
                text: 'Cancel',
                role: 'cancel',
                handler: () => {
                    //this.isExitAlertOpen = false;
                }
            }
        ]
    }).present();
}

  initTranslate() {
    // Set the default language for translation strings, and the current language.
    this.translate.setDefaultLang("en");
    const browserLang = this.translate.getBrowserLang();

    if (browserLang) {
      if (browserLang === "zh") {
        const browserCultureLang = this.translate.getBrowserCultureLang();

        if (browserCultureLang.match(/-CN|CHS|Hans/i)) {
          this.translate.use("zh-cmn-Hans");
        } else if (browserCultureLang.match(/-TW|CHT|Hant/i)) {
          this.translate.use("zh-cmn-Hant");
        }
      } else {
        this.translate.use(this.translate.getBrowserLang());
      }
    } else {
      this.translate.use("en"); // Set your language here
    }

    this.translate.get(["BACK_BUTTON_TEXT"]).subscribe(values => {
      this.config.set("ios", "backButtonText", "");
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
  logOut() {
    this.userSrv._LogoutUser();
    // when user logout
    this.menu.enable(false);
    this.nav.push(LoginPage);
  }
  downloadPDF() {
    var url =
      "https://meschinowellness.blob.core.windows.net/downloads/Optimal_Living_Program.pdf";
    window.open(url, "_system", "location=yes");
  }
  openPortal() {
    this.PortalURL =
      this.MainSiteUrl +
      "account/MobileAppLogin?SecretToken=" +
      localStorage.getItem("SecretToken") +
      "&DeviceId=" +
      localStorage.getItem("deviceid") +
      "&tokenP=" +
      localStorage.getItem("Password");
    var url = this.PortalURL;
    console.log(url);
    window.open(url, "_system", "location=yes");
  }

  LoadNotifications() {
    if (
      localStorage.getItem("UserInfo") !== undefined &&
      localStorage.getItem("UserInfo") !== null &&
      localStorage.getItem("UserName") !== undefined &&
      localStorage.getItem("UserName") !== null
    ) {
      /*
      let res = {Count : 0}; 
      let oldCount = localStorage.getItem("notificationCount");
      if(oldCount !=="" && oldCount !== undefined )
      {
        res.Count = parseInt(oldCount) + 1;
        this.events.publish("PushNotification", res);
      }
*/
      
      const userAcc = {
        DeviceId: localStorage.getItem("deviceid"),
        SecretToken: localStorage.getItem("SecretToken")
      };
      this.userSrv.GetPushNotificationCount(userAcc).subscribe(
        (res: any) => {
          if (res.SystemStatus == "Success") {
            this.events.publish("PushNotification", res);
          }
        },
        err => {
          //alert(JSON.stringify(err));
          console.log(JSON.stringify(err));
        }
      );
    }
  }

  private notificationSetup(uuid) {
    this.fcmSrv.getToken(uuid);
    this.fcmSrv.onNotifications().subscribe(msg => {
      //     alert(msg);
      // if (msg.wasTapped) {
      //   alert('Received in background');
      // } else {
      //   alert('Received in foreground');
      // }
      if (this.platform.is("ios")) {
        this.presentToast(msg.body, msg);
      } else {
        this.presentToast(msg.body, msg);
      }
    });
  }

  async presentToast(message, msg) {
    await this.LoadNotifications();
    const toast = await this.toastController.create({
      message,
      duration: 4000,
      position: "top"
    });
    toast.present();
  }
  ViewTemplate(Name: any) {
    this.nav.push(TemplatePage, {
      Content: Name
    });
  }
}
