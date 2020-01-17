import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  Events,
  MenuController
} from "ionic-angular";
import { NotificationService, UserService } from "../../providers";
import { NotificationPage } from "../notification/notification";
import { TemplatePage } from "../templates/template";

/**
 * Generated class for the DashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-my-wellness-wallet",
  templateUrl: "my-wellness-wallet.html"
})
export class MyWellnessWalletPage {
  account: {
    deviceid: string;
    SecretToken: string;
    FirstName: string;
    LastName: string;
  } = {
    deviceid: "",
    SecretToken: "",
    FirstName: "",
    LastName: ""
  };
  loader: any;
  rewardpoints: number = 0;
  bio_age: string = "0";
  mhrs_score: string = "0";
  profilepic: string = "assets/img/loader.gif";

  IsHRACompleted: boolean = false;

  notificationCount: string = ""; //localStorage.getItem("NotificationCount");

  FCMToken : string = localStorage.getItem("FCMToken");

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loading: LoadingController,
    public userService: UserService,
    public notificationService: NotificationService,
    public events: Events,
    public menu : MenuController
  ) {
    this.menu.enable(true);
    this.IsHRACompleted =
      localStorage.getItem("IsHRACompleted") == "true" ? true : false;
    console.log(this.IsHRACompleted, "IsHRACompleted");
    this.loader = this.loading.create({
      content: "Please wait..."
    });
    this.loader.present().then(() => {
      this.loadNotificationCount();
      this.EmitterNotificationCount()
      this.loadUserInfo();
    });
  }

  loadUserInfo() {
    this.account.FirstName = localStorage.getItem("FirstName");
    this.account.LastName = localStorage.getItem("LastName");
    this.rewardpoints = parseInt(localStorage.getItem("RewardPoint"));
    this.profilepic = localStorage.getItem("ProfileImage");
    this.bio_age = localStorage.getItem("bio_age");
    this.mhrs_score = localStorage.getItem("mhrs_score");

    const userAcc = {
      DeviceId: localStorage.getItem("deviceid"),
      SecretToken: localStorage.getItem("SecretToken")
    };
    this.userService.getUserData(userAcc).subscribe((res: any) => {
      localStorage.setItem("RewardPoint", res.RewardPoint);
      localStorage.setItem("bio_age", res.bio_age);
      localStorage.setItem("mhrs_score", res.mhrs_score);
      this.rewardpoints = parseInt(localStorage.getItem("RewardPoint"));
      this.bio_age = localStorage.getItem("bio_age");
      this.mhrs_score = localStorage.getItem("mhrs_score");
    });

    this.loader.dismiss();
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad MyWellnessWalletPage");
  }
  gotoUrl(navurl: string) {
    this.navCtrl.setRoot(navurl);
  }

  loadNotificationCount() {
    const userAcc = {
      DeviceId: localStorage.getItem("deviceid"),
      SecretToken: localStorage.getItem("SecretToken")
    };
    this.userService.GetPushNotificationCount(userAcc).subscribe((res: any) => {
      let msgcount = res.Count;
      this.notificationCount = msgcount > 0 ? msgcount : "";
      localStorage.setItem("notificationCount", this.notificationCount);
    });
  }
  EmitterNotificationCount() {
    this.events.subscribe("PushNotification", PushNotification => {
      let msgcount = PushNotification.Count;
      this.notificationCount = msgcount > 0 ? msgcount : "";
      localStorage.setItem("notificationCount", this.notificationCount);
    });
  }
  goNotification() {
    this.navCtrl.push(NotificationPage);
  }

  ViewTemplate(Name: any) {
    this.navCtrl.push(TemplatePage, {
      Content: Name
    });
  }
}
