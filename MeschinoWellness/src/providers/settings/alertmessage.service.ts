import { Injectable } from "@angular/core";
import {
  ToastController,
  LoadingController,
  AlertController
} from "ionic-angular";

@Injectable()
export class AlertMessagesService {
  constructor(
    public toastCtl: ToastController,
    public loadingCtl: LoadingController,
    public alertCtl: AlertController
  ) {}

  async presentToast(message) {
    const toast = await this.toastCtl.create({
      message,
      duration: 4000,
      position: "top"
    });
    toast.present();
  }

  async presentErrorToast(message: string) {
    const toast = await this.toastCtl.create({
      message,
      position: "top",
      duration: 4000,
      cssClass: "toast-error"
    });
    toast.present();
  }

  PleaseWait() {
    return this.loadingCtl.create({
      content: "Please wait..."
    });
  }
  LoadingMsg(msg) {
    return this.loadingCtl.create({
      content: msg
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

  ErrorMsg(err, apiName) {
    if (err.error !== undefined && err.error.SystemMessage !== undefined) {
      this.presentAlert(err.error.SystemMessage);
    } else {
      this.presentAlert("Server Message -" + apiName + " : " + JSON.stringify(err));
    }
  }
}
