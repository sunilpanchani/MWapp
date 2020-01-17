import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  LoadingController
} from "ionic-angular";
import { HraBodyPage } from "../hra-body/hra-body";
import { HraQaPage } from "../my-wellness-wallet/hra-qa/hra-qa";
import { LoginPage } from "../login/login";
import { HraService } from "../../providers";

/**
 * Generated class for the MyHraPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-my-hra",
  templateUrl: "my-hra.html"
})
export class MyHraPage {
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

  rewardpoints: number = 0;
  profilepic: string = "assets/img/avtar.jpg";
  bio_age: string = "0";
  mhrs_score: string = "0";

  loader: any;
  HraDetailSections: any = { lst_hra_section: [] };
  RiskReportDetails: any;
  resetFlg: boolean = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public hraApi: HraService,
    public alertCtl: AlertController,
    public loading: LoadingController
  ) {
    this.loader = this.loading.create({
      content: "Please wait..."
    });
    this.loader.present().then(() => {
      //this.loadUserInfo();
      //});
      this.GetMyHraDetail();
    });
    this.RiskReportDetails = JSON.parse(
      localStorage.getItem("RiskReportDetails")
    );
    if (this.RiskReportDetails && this.RiskReportDetails.length > 0) {
      this.presentConfirm();
    } else {
      console.log("Reset Form");
    }
  }

  // loadUserInfo() {
  //   this.account.FirstName = localStorage.getItem("FirstName");
  //   this.account.LastName = localStorage.getItem("LastName");
  //   this.rewardpoints = parseInt(localStorage.getItem("RewardPoint"));
  //   this.profilepic = localStorage.getItem("ProfileImage");
  //   //this.bio_age = localStorage.getItem("bio_age");
  //   //this.mhrs_score = localStorage.getItem("mhrs_score");
  //   // this.loader.dismiss();
  // }

  presentConfirm() {
    let alert = this.alertCtl.create({
      message: "You did not complete the HRA during your last session, Would you like to continue from where left off?",
      cssClass: "action-sheets-basic-page",
      buttons: [
        {
          text: "Resume",
          role: "cancel",
          handler: () => {
            this.resetFlg = false;
          }
        },
        {
          text: "Beginning",
          handler: () => {
            this.resetFlg = true;
          }
        }
      ]
    });
    alert.present();
  }
  ionViewCanEnter()
  {
    console.log('page view enter');
  }
  ionViewDidLoad() {
    console.log("ionViewDidLoad MyHraPage");
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

  GetMyHraDetail() {
    this.account.deviceid = localStorage.getItem("deviceid");
    this.account.SecretToken = localStorage.getItem("SecretToken");

    this.loader.present().then(() => {
      this.hraApi.GetHraSections(this.account).subscribe(
        resp => {
          this.loader.dismiss();
          this.HraDetailSections = resp;
          console.log("HRA-response : ", this.HraDetailSections);
          localStorage.setItem(
            "HraDetailSections",
            JSON.stringify(this.HraDetailSections.lst_hra_section)
          );
          localStorage.setItem(
            "RiskReportDetails",
            JSON.stringify(this.HraDetailSections.RiskReportDetails)
          );
        },
        err => {
          this.loader.dismiss();
          // Unable to log in
          //this.presentAlert("Server Message- Get HRA Sections : "+err.error.SystemMessage);
          this.presentAlert("Server Message - Get HRA Sections "+ JSON.stringify(err));
          //this.navCtrl.push(LoginPage);
        }
      );
    });
  }

  goToHraDetail(cardData: any, nextCardIndex: any) {
    if (this.IsCheckAllow(cardData, true)) {
      this.navCtrl.push(HraQaPage, {
        cardData: cardData,
        nextCardIndex: nextCardIndex,
        resetFlg: this.resetFlg
      });
    }
    else {
      this.presentAlert("Invalid steps!");
    }
  }

  IsCheckAllow(cardData: any, allowNext : boolean)
  {
    if (this.HraDetailSections.lstCompletedSection.indexOf(cardData.report_section_num) !== -1 || 
    (this.HraDetailSections.lstCompletedSection.indexOf(cardData.report_section_num - 1) !== -1 && allowNext)
    || cardData.report_section_num == 16) {

     return true;
    }
    else {
     return false
    }
  }
}
