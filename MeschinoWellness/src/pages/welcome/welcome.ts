import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  ToastController,
  Events,
  MenuController
} from "ionic-angular";
import { LoginPage } from "../login/login";
import { SignupPage } from "../signup/signup";
import { MyWellnessWalletPage } from "../my-wellness-wallet/my-wellness-wallet";
import { AlertMessagesService } from "../../providers/settings/alertmessage.service";

/**
 * The Welcome Page is a splash page that quickly describes the app,
 * and then directs the user to create an account or log in.
 * If you'd like to immediately put the user onto a login/signup page,
 * we recommend not using the Welcome page.
 */
@IonicPage()
@Component({
  selector: "page-welcome",
  templateUrl: "welcome.html"
})
export class WelcomePage {
  loader: any;
  constructor(
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public events: Events,
    private menu: MenuController,
    private alertSrv: AlertMessagesService
  ) {
    this.loader = this.alertSrv.LoadingMsg("Loading...");
    this.loader.present().then(() => {
      if (
        localStorage.getItem("UserInfo") !== undefined &&
        localStorage.getItem("UserInfo") !== null
      ) {
        var userInfo = JSON.parse(localStorage.getItem("UserInfo"));
        this.menu.enable(true);
        console.log(userInfo);
        this.events.publish("user:created", userInfo);
        setTimeout(() => {
          this.loader.dismiss();
          this.navCtrl.setRoot(MyWellnessWalletPage);
        }, 1000);
      } else {
        this.menu.enable(false);
        this.loader.dismiss();
      }
    });
  }
  ionViewDidLoad() {}
  login() {
    this.navCtrl.push(LoginPage);
  }

  signup() {
    this.navCtrl.push(SignupPage);
  }
}
