import { Component, ViewChild } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  AlertController,
  Navbar
} from "ionic-angular";
import { NotificationService } from "../../providers";
import { NotificationPage } from "../notification/notification";

/**
 * Generated class for the IntroPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-notimsg",
  templateUrl: "notimsg.html"
})
export class NotificationMsgPage {

  @ViewChild('navbar') navBar: Navbar;
  
  TempaletName: string;
  Title: string;
  loader: any;
  item: any = {};
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public alertCtl: AlertController,
    public notificationService: NotificationService
  ) {
    this.item = JSON.parse(localStorage.getItem("noti-item"));
    this.Title = "Message Info";
    this.MarkMessageRead(this.item);
  }
  
  MarkMessageRead(item: any) {
    if (!item.IsRead) {
      const userAcc = {
        DeviceId: localStorage.getItem("deviceid"),
        SecretToken: localStorage.getItem("SecretToken"),
        Id: item.Id
      };
      this.notificationService
        .UpdateIsReadPushNotificationDetail(userAcc)
        .subscribe(
          (resp: any) => {
            console.log("Marked user read data");
            item.IsRead = true;
          },
          err => {
            this.loader.dismiss();
            this.presentAlert(
              "Server Message - Update Is Read Push Notification Detail : " +
              JSON.stringify(err)
            );
          }
        );
    }
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad TemplatePage");
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
  ionViewDidEnter() {
    this.navBar.backButtonClick = () => {
      ///here you can do wathever you want to replace the backbutton event
      console.log('Back button click');
      localStorage.removeItem("noti-item");
      this.navCtrl.push(NotificationPage)
    };

  }
}
