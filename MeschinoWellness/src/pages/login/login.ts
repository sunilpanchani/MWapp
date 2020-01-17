import { Component } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  IonicPage,
  NavController,
  Events,
  AlertController,
  LoadingController,
  MenuController
} from "ionic-angular";

import { UserService } from "../../providers";
import { SignupPage } from "../signup/signup";
import { MyWellnessWalletPage } from "../my-wellness-wallet/my-wellness-wallet";
import { ForgetPasswordPage } from "../forgetpassword/forgetpassword";

@IonicPage()
@Component({
  selector: "page-login",
  templateUrl: "login.html"
})
export class LoginPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: {
    UserName: string;
    Password: string;
    apiKey: string;
    deviceid: string;
  } = {
    UserName: "",
    Password: "",
    apiKey: "",
    deviceid: ""
  };
  loader: any;
  // Our translated text strings
  Rememberme: boolean;

  constructor(
    public navCtrl: NavController,
    public user: UserService,
    public translateService: TranslateService,
    private events: Events,
    private alertCtl: AlertController,
    private loading: LoadingController,
    private menu: MenuController
  ) {
    this.menu.enable(false);
    this.Rememberme = true;
    // set remember me
    this.account.UserName =
      window.localStorage.getItem("remuser") == null
        ? ""
        : window.localStorage.getItem("remuser");
    this.account.Password =
      window.localStorage.getItem("rempwd") == null
        ? ""
        : window.localStorage.getItem("rempwd");
  }


  signup() {
    this.navCtrl.push(SignupPage);
  }
  validateForm() {
    if (this.account.UserName == "" || this.account.Password == "") {
      this.presentAlert("Please enter Username and Password");
      return false;
    } else {
      return true;
    }
  }
  doForget() {
    this.navCtrl.setRoot(ForgetPasswordPage);
  }

  private async SaveUserTokenInDB() {
    if (
      localStorage.getItem("deviceid") !== null &&
      localStorage.getItem("deviceid") !== undefined &&
      localStorage.getItem("FCMToken") !== null &&
      localStorage.getItem("FCMToken") !== undefined &&
      localStorage.getItem("DeviceType") !== null &&
      localStorage.getItem("DeviceType") !== undefined 
    ) {
      const accountinfo = {
        deviceid: localStorage.getItem("deviceid"),
        SecretToken: localStorage.getItem("SecretToken"),
        DeviceType: localStorage.getItem("DeviceType"),
        UserTokenId: localStorage.getItem("FCMToken")
      };

      await this.user.SaveUserTokenIdData(accountinfo).subscribe(
        resp => {
          console.log("save token success");
        },
        err => {
          this.presentAlert(
            "Server Message - Save User TokenId Data : " + JSON.stringify(err)
          );
        }
      );
    } else {
      console.log("Please allow your phone to access the device types");
    }
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
  // Attempt to login in through our User service
  doLogin() {
    // if (this.account.UserName !== localStorage.getItem("remuser")) {
    //   this.fcm.deleteToken();
    // }

    if (this.validateForm()) {
      this.loader = this.loading.create({
        content: "Please wait..."
      });
      if (this.Rememberme) {
        window.localStorage.setItem("remuser", this.account.UserName);
        window.localStorage.setItem("rempwd", this.account.Password);
      } else {
        window.localStorage.removeItem("remuser");
        window.localStorage.removeItem("rempwd");
      }
      this.account.apiKey = "71e73c14-2723-4d6e-a489-c9675738fdf4";
      this.account.deviceid = localStorage.getItem("remUUID");
      localStorage.setItem("deviceid", this.account.deviceid);
      //alert('deviceid : '+this.account.deviceid);
      if (localStorage.getItem("remUUID") == null)
        this.account.deviceid = "c9675738fdf4";

      this.loader.present().then(() => {
        this.user.login(this.account).subscribe(
          (resp: any) => {
            console.log("user", { resp });
            this.menu.enable(true);
            if ((resp.SystemStatus = "Success")) {
              this.events.publish("user:created", resp);
              this.SaveUserTokenInDB();
              setTimeout(() => {
                this.loader.dismiss();
                this.navCtrl.setRoot(MyWellnessWalletPage);
              }, 3000);
            } else {
              this.presentAlert(resp.SystemMessage);
            }
          },
          err => {
            this.loader.dismiss();
            //this.presentAlert("Server Message - User Login : "+ JSON.stringify(err));
            
            this.presentAlert(err.error.SystemMessage);
            this.user._LogoutUser();
          }
        );
      });
    }
  }
}
