import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  LoadingController,
  Events,
  MenuController
} from "ionic-angular";
import { LoginPage } from "../../login/login";
import { HraService, UserService, NotificationService } from "../../../providers";
import { RiskDetailPage } from "../riskdetail/riskdetail";
import { NotificationPage } from "../../notification/notification";

/**
 * Generated class for the MyHraPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-my-wellness-plan",
  templateUrl: "mywellnessplan.html"
})
export class MyWellnessPlanPage {
  account: { deviceid: string; SecretToken: string; UserId: string } = {
    deviceid: "",
    SecretToken: "",
    UserId: ""
  };

  loader: any;
  resetFlg: boolean;
  HealthRisks: any;
  notificationCount : string = ""//localStorage.getItem("NotificationCount");
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtl: AlertController,
    public loading: LoadingController,
    private hraApi: HraService,
    public userService : UserService,
    public notificationService : NotificationService,
    public events: Events,
    public menu : MenuController
  ) {

    this.menu.enable(true);

    this.loader = this.loading.create({
      content: "Please wait..."
    });
    localStorage.removeItem("RiskNumber");
    this.loader.present().then(() => {
      this.loadInitialNotificationCount();
      this.EmitterNotificationCount()
      this.GetHealthRisks();
    });
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad MyWellnessPlanPage");
  }
  ionViewDidLeave()
  {
    console.log('ionViewDidLeave');
    debugger;
  }
  ionViewWillLeave()
  {
    console.log('ionViewWillLeave');
    debugger;
  }
  loadInitialNotificationCount()
  {
    
    const userAcc = {
      DeviceId: localStorage.getItem("deviceid"),
      SecretToken: localStorage.getItem("SecretToken"),
    }  
    this.userService.GetPushNotificationCount(userAcc).subscribe((res: any) =>
    {
      let msgcount = res.Count;
      this.notificationCount = msgcount > 0 ? msgcount : "";
      localStorage.setItem("notificationCount", this.notificationCount);
    });
    
  }
  EmitterNotificationCount()
  {
    this.events.subscribe("PushNotification", PushNotification => {   
      let msgcount = PushNotification.Count;
      this.notificationCount = msgcount > 0 ? msgcount : "";
      localStorage.setItem("notificationCount", this.notificationCount);
     });     
  }

  GetHealthRisks() {
    this.account.deviceid = localStorage.getItem("deviceid");
    this.account.SecretToken = localStorage.getItem("SecretToken");
    this.account.UserId = localStorage.getItem("UserId");
    this.hraApi.GetMajorHealthRisks(this.account).subscribe(
      resp => {
        this.loader.dismiss();
        this.HealthRisks = this.hraApi.MajorHealthRisks.RiskList;
      },
      err => {
        this.loader.dismiss();
        // Unable to log in
        this.presentAlert("Server Message - Get Major Health Risks: "+ JSON.stringify(err));
        //this.navCtrl.push(LoginPage);
      }
    );
  }

  async presentAlert(msg) {
    const alert = await this.alertCtl.create({
      message: msg,
      cssClass: "action-sheets-basic-page",
      buttons: [
        {
          text: "OK",
          handler: () => {}
        }
      ]
    });
    await alert.present();
  }
  
  goToReportDetail(id) {
    localStorage.setItem("RiskNumber", id);
    this.navCtrl.push(RiskDetailPage);
  }

  goNotification()
  {    
    this.navCtrl.push(NotificationPage);
  }
}
