import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  LoadingController
} from "ionic-angular";
import { IntroVideoPage } from "../intro-video/intro-video";
import { UserService } from "../../providers";

/**
 * Generated class for the IntroPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-intro",
  templateUrl: "intro.html"
})
export class IntroPage {
  account: { deviceid: string; SecretToken: string, FirstName: string, LastName:string } = {
    deviceid: "",
    SecretToken: "",
    FirstName: "", 
    LastName:""
  };
  loader: any;
  constructor(
    public user: UserService,
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtl : AlertController,
    public loading : LoadingController
  ) {
    this.account.deviceid = localStorage.getItem("deviceid");
    this.account.SecretToken = localStorage.getItem("SecretToken");
    this.account.FirstName = localStorage.getItem("FirstName");
    this.account.LastName = localStorage.getItem("LastName");
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad IntroPage");
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
  goToVideo() {
    this.loader = this.loading.create({
      content: "Please wait..."
    });

    this.loader.present().then(() => {
      this.user.SaveUserAgreeTermsCondition(this.account).subscribe(
        resp => {
          this.loader.dismiss();
          
          this.navCtrl.push(IntroVideoPage);
        },
        err => {
          this.loader.dismiss();
          //this.presentAlert("Server Message - Save User Agree Terms Condition: "+ err.error.SystemMessage);
          this.presentAlert("Server Message - Save User Agree Terms Condition"+ JSON.stringify(err));
        }
      );
    });
  }
}
