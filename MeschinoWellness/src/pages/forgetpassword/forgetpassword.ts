import { Component } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  IonicPage,
  NavController,
  LoadingController,
  AlertController
} from "ionic-angular";
import { FormControl, FormGroup, FormBuilder } from "@angular/forms";

import { UserService } from "../../providers";

import * as $ from "jquery";
import { LoginPage } from "../login/login";
import { WellnessConstants } from "../../providers/settings/wellnessconstant";

@IonicPage()
@Component({
  selector: "page-forgetpassword",
  templateUrl: "forgetpassword.html"
})
export class ForgetPasswordPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: {
    Email: string;
    apiKey: string;
    deviceid: string;
  } = {
    Email: "",
    apiKey: "",
    deviceid: ""
  };

  loader: any;
  constructor(
    public navCtrl: NavController,
    public user: UserService,
    public formBuilder: FormBuilder,
    public translateService: TranslateService,
    public loading : LoadingController,
    public alertCtl : AlertController
  ) {
  } 

  validateFuncation() {
    var msg: string;
    if (this.account.Email == "") {
      msg = "Please enter email.";
    }
    if (msg != "" && msg != undefined) {
      this.presentAlert(msg);
      return true;
    } else {
      return false;
    }
  }

  commandUrl: string = WellnessConstants.App_Url+'api/WellnessAPI/UserForgotPassword';

  doSubmit() {
    if (!this.validateFuncation()) {
      this.loader = this.loading.create({
        content: "Please wait..."
      });
      this.account.apiKey = "71e73c14-2723-4d6e-a489-c9675738fdf4";
      this.account.deviceid = "c9675738fdf4";

      this.loader.present().then(() => {
         this.user.forgetpassword(this.account).subscribe(
          (res : any) => {
            this.loader.dismiss();
            console.log(res);
            this.presentAlert(res.SystemMessage);      
          },
          err => {
            this.loader.dismiss();
            //this.presentAlert("Server Message - User Forgot Password : "+ err.error.SystemMessage);
            this.presentAlert("Server Message - User Forgot Password : "+ JSON.stringify(err));
          }
        );
      });
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
  
  loginup() {
    this.navCtrl.push(LoginPage);
  }
  /*
  PostJson(pUrl, data, fnSuccessCallBack, fnErrorCallBack) {
    $.ajax({
      type: "POST",
      url: pUrl,
      data: data,
      contentType: "application/x-www-form-urlencoded",
      success: function(msg) {
        if (fnSuccessCallBack != undefined) {
          fnSuccessCallBack(msg);
        }
      },
      error: function(xhr, errStatus, error) {
        if (fnErrorCallBack == undefined) {
          alert(error + " " + errStatus);
        } else {
          fnErrorCallBack(error, errStatus);
        }
      }
    });
  }
  */
}
