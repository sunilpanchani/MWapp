import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  LoadingController,
  Events
} from "ionic-angular";
import { LoginPage } from "../../login/login";
import { MyWellnessPlanPage } from "../mywellnessplan/mywellnessplan";
import { HraService, UserService } from "../../../providers";

/**
 * Generated class for the MyHra result Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-my-hra-result",
  templateUrl: "hra-result.html"
})
export class MyHraResultPage {
  account: {
    deviceid: string;
    SecretToken: string;
    Accept: boolean;
    RiskReportNum: number;
  } = {
    deviceid: "",
    SecretToken: "",
    RiskReportNum: 0,
    Accept: false
  };

  loader: any;
  RiskReportDetails: any;
  resetFlg: boolean = true;
  userName: string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtl: AlertController,
    public loading: LoadingController,
    public hraApi: HraService,
    private events: Events,
    private userService: UserService
  ) {
    this.userName =
      localStorage.getItem("FirstName") +
      " " +
      localStorage.getItem("LastName");
    this.loader = this.loading.create({
      content: "Please wait..."
    });
    localStorage.setItem("IsHRACompleted", "true");
    this.GetMyHraResults();
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad My HRA confirm Page");
  }
  

  GetMyHraResults() {
    this.account.deviceid = localStorage.getItem("deviceid");
    this.account.SecretToken = localStorage.getItem("SecretToken");
    this.loader.present().then(() => {
      //this.loader.dismiss();

      this.hraApi.GetRiskReportNum(this.account).subscribe(
        (resp1: any) => {
          //debugger;
          //console.log(resp1);
          console.log(this.hraApi.hraRiskReport.RiskReportNum);

          this.account.RiskReportNum = parseInt(
            this.hraApi.hraRiskReport.RiskReportNum
          ); //localStorage.getItem('riskreportnum'));

          this.hraApi.GetHraReport(this.account).subscribe(
            resp => {
              this.loader.dismiss();
              console.log(this.hraApi.hraResults);
              this.RiskReportDetails = this.hraApi.hraResults.UserConditions;
              //debugger;
              console.log({ LstReport: this.RiskReportDetails });
            },
            err => {
              this.loader.dismiss();
              // Unable to log in
              this.presentAlert("Server Message - Get Identified Conditions API: " + JSON.stringify(err));
              //this.navCtrl.push(LoginPage);
            }
          );
        },
        err => {
          this.loader.dismiss();
          // Unable to log in
          //this.presentAlert(err.error.SystemMessage);
          //this.navCtrl.push(LoginPage);
        }
      );
    });
  }
  public submitConfirm() {
    console.log(this.account.Accept);
    if (this.account.Accept) {
      this.presentAlertRedirect("HRA confirm section data saved successfully.");
    } else {
      this.presentAlert("Please tick check box to accept");
    }
  }

  async presentAlertRedirect(msg) {
    const alert = await this.alertCtl.create({
      message: msg,
      cssClass: "action-sheets-basic-page",
      /* buttons: [
        {
          text: "OK",
          handler: () => {
            this.navCtrl.setRoot(MyWellnessPlanPage);
          }
        }
      ]*/
    });
    //await alert.present();
    await alert.present().then(() => {
      // hide the alert after 2 sec
      this.LoadHRAUserData();
      setTimeout(() => {
        alert.dismiss();
        this.navCtrl.setRoot(MyWellnessPlanPage);
      }, 1000);
    });
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

  LoadHRAUserData() {
    const userAcc = {
      DeviceId: localStorage.getItem("deviceid"),
      SecretToken: localStorage.getItem("SecretToken")
    };
    this.userService.getUserData(userAcc).subscribe((res: any) => {
      console.log(res, "getUserData");
      const data = {};
      localStorage.setItem("RewardPoint", res.RewardPoint);
      localStorage.setItem("bio_age", res.bio_age);
      localStorage.setItem("mhrs_score", res.mhrs_score);
      // Read all the data;
      data["FirstName"] = localStorage.getItem("FirstName");
      data["LastName"] = localStorage.getItem("LastName");
      data["ProfileImage"] = localStorage.getItem("ProfileImage");
      data["Gender"] = localStorage.getItem("Gender");
      data["Height"] = localStorage.getItem("Height");
      data["BirthDate"] = localStorage.getItem("BirthDate");
      data["RewardPoint"] = localStorage.getItem("RewardPoint");
      data["bio_age"] = localStorage.getItem("bio_age");
      data["mhrs_score"] = localStorage.getItem("mhrs_score");

      console.log("Event published : " + data);
      this.events.publish("user:created", data);
    });
  }
}
