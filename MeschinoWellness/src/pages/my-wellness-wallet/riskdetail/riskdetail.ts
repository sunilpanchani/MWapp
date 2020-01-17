import { Component } from "@angular/core";
//import { InAppBrowser } from 'ionic-native';
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  LoadingController
} from "ionic-angular";
import { LoginPage } from "../../login/login";
import { HraService } from "../../../providers";
import { WellnessConstants } from "../../../providers/settings/wellnessconstant";

/**
 * Generated class for the MyHraPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-my-riskdetail",
  templateUrl: "riskdetail.html"
})
export class RiskDetailPage {
  account: {
    deviceid: string;
    SecretToken: string;
    RiskNumber: number;
    password: string;
  } = {
    deviceid: "",
    SecretToken: "",
    RiskNumber: 0,
    password: ""
  };

  loader: any;
  resetFlg: boolean;
  HealthRiskDetail: any;
  title: string;
  GoalList: any[] = [];
  MeterList: any[] = [];
  siteUrl: string = WellnessConstants.App_Url;
  redirectURL = "";
  ShowRecommendedGoals: boolean = true;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtl: AlertController,
    public loading: LoadingController,
    private hraApi: HraService
  ) {
    this.loader = this.loading.create({
      content: "Please wait..."
    });
    this.title = "Major Health Risk Detail";
    this.redirectURL =
      this.siteUrl +
      "account/SetGoalLogin?SecretToken=" +
      localStorage.getItem("SecretToken") +
      "&DeviceId=" +
      localStorage.getItem("deviceid") +
      "&tokenP=" +
      localStorage.getItem("Password") +
      "&GoalNum=";

    this.ShowRecommendedGoals = false;
    this.loader.present().then(() => {
      this.GetHealthRiskDetails();
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
  ionViewDidLoad() {
    console.log("ionViewDidLoad RiskDetailPage");
  }
  
  GetHealthRiskDetails() {
    this.account.deviceid = localStorage.getItem("deviceid");
    this.account.SecretToken = localStorage.getItem("SecretToken");
    this.account.RiskNumber = parseInt(localStorage.getItem("RiskNumber"));
    this.loader.present().then(() => {
      this.hraApi.GetHealthRiskDetail(this.account).subscribe(
        resp => {
          this.loader.dismiss();
          this.ShowRecommendedGoals = true;
          this.HealthRiskDetail = this.hraApi.HealthRiskDetail;
          this.MeterList = this.hraApi.HealthRiskDetail.MeterList;
          this.GoalList = this.hraApi.HealthRiskDetail.GoalList;
        },
        err => {
          this.loader.dismiss();
          // Unable to log in
          this.presentAlert("Server Message - Get Health Risk Detail : "+JSON.stringify(err));
          //this.navCtrl.push(LoginPage);
        }
      );
    });
  }

  goToReportDetail(cardData: any, nextCardIndex: any) {
    //this.navCtrl.push();
  }

  SetGoals(num) {
    if (localStorage.getItem("UserAccessLevel") !== null && localStorage.getItem("UserAccessLevel") !== "Full") {
        let alertP = this.alertCtl.create({
        message: "We are sorry, you do not have the permission to set goals. For information please contact the Administrator.",
        cssClass: "action-sheets-basic-page",
        buttons: [
          {
            text: "Ok"
          }
        ]
      });
      alertP.present();
    } else {
      let url = this.redirectURL + num;
      let alertP = this.alertCtl.create({
        message:
          "You will be redirected to a browser. Do you want to continue?",
        cssClass: "action-sheets-basic-page",
        buttons: [
          {
            text: "Yes",
            handler: () => {
              console.log(url, "url");
              //alert(url);
              setTimeout(function() {
                window.open(url, "_system", "location=yes");
              }, 1000);
            }
          },
          {
            text: "No",
            handler: () => {
              //alertP.dismiss();
            }
          }
        ]
      });
      alertP.present();
    }
  }
}
