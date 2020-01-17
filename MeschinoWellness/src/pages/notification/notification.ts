import { Component, ViewChild } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  AlertController,
  Events,
  Content,
  MenuController
} from "ionic-angular";

import { HttpClient } from "@angular/common/http";

import * as $ from "jquery";
import { FormBuilder } from "@angular/forms";
import { UserService, NotificationService } from "../../providers";
import { MyWellnessWalletPage } from "../my-wellness-wallet/my-wellness-wallet";
import { NotificationMsgPage } from "../notificationmsg/notimsg";

/**
 * Generated class for the DashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-notification",
  templateUrl: "notification.html"
})
export class NotificationPage {
  customText: boolean = true;
  Notifications: any = [];
  account: {
    deviceid: string;
    SecretToken: string;
    PushNotificationYesNo: string;
    DeviceToken: string;
    PageSize: number;
    PageIndex: number;
  } = {
    deviceid: "",
    SecretToken: "",
    PushNotificationYesNo: "",
    DeviceToken: localStorage.getItem("FCMToken"),
    PageSize: 50,
    PageIndex: 1
  };
  currentIndex: any = 1;
  loader: any;
  ischecked: boolean = true;
  constructor(
    public navCtrl: NavController,
    public formBuilder: FormBuilder,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public alertCtl: AlertController,
    public http: HttpClient,
    private userService: UserService,
    public notificationService: NotificationService,
    public events: Events,
    public menu : MenuController
  ) {
    
    //this.menu.enable(true);
    this.account.deviceid = localStorage.getItem("deviceid");
    this.account.SecretToken = localStorage.getItem("SecretToken");
    if (
      localStorage.getItem("PushNotificationYesNo") !== null &&
      localStorage.getItem("PushNotificationYesNo") == "Yes"
    ) {
      this.ischecked = true;
    } else {
      this.ischecked = false;
    }
  }

  ionViewDidLoad() {
    if(localStorage.getItem("currentIndex") !== undefined && localStorage.getItem("currentIndex")!== null)
    {
      this.currentIndex = parseInt(localStorage.getItem("currentIndex"));
    }
    else
    {
      this.currentIndex = 1;
    }
    //localStorage.removeItem("currentIndex");
    this.LoadMessage();
    //this.AddFromEvents();
    console.log("ionViewDidLoad DashboardPage");
  }

  notify(event) {
    console.log(event.checked);
    this.ischecked = event.checked;
    if (event.checked) {
      this.account.PushNotificationYesNo = "Yes";
    } else {
      this.account.PushNotificationYesNo = "No";
    }
    this.loader = this.loadingCtrl.create({
      content: "Please wait..."
    });

    this.loader.present().then(() => {
      this.userService.SaveUserPushNotificationOnOff(this.account).subscribe(
        resp => {
          this.loader.dismiss();
          this.presentAlert("Successfully saved your request!");
          localStorage.setItem(
            "PushNotificationYesNo",
            this.account.PushNotificationYesNo
          );
        },
        err => {
          this.loader.dismiss();
          this.presentAlert(
            "Server Message - Save User Push Notification On Off : " +
              JSON.stringify(err)
            //err.error.SystemMessage
          );
        }
      );
    });
  }
  doRefresh(refresher) {
    refresher.complete();
    this.LoadMessage();
  }
  LoadMessage() {
    //let _CurrentNotifications = this.Notifications.length > 0 ? this.Notifications : [];
    this.loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    this.loader.present().then(() => {
      this.account.PageIndex = this.currentIndex;
      this.userService.GetUserPushNotificationDetail(this.account).subscribe(
        (resp: any) => {
          if (resp.lstPushNotificationDetail != null) {
            resp.lstPushNotificationDetail.sort(
              (a, b) =>
                new Date(b.CreateDate).getTime() -
                new Date(a.CreateDate).getTime()
            );
            let _curNotifications = resp.lstPushNotificationDetail;
            for (var i = 0; i < _curNotifications.length; i++) {
              _curNotifications[i].showfull = false;
              if (_curNotifications[i].Message.length <= 55) {
                _curNotifications[i].HideButton = true;
              }
              if (this.currentIndex > 1 && _curNotifications.length > 0) {
                // add to exiting loaded items
                this.Notifications.push(_curNotifications[i]);
               }
            }
            if (this.currentIndex == 1 && _curNotifications.length > 0) {
              this.Notifications = [];
              this.Notifications = _curNotifications;
            }
          }
          // if (refresher !== undefined && refresher !== null) {
          //   refresher.complete();
          // }
          this.loader.dismiss();
          console.log(this.Notifications);
        },
        err => {
          this.loader.dismiss();
          // if (refresher !== undefined && refresher !== null) {
          //   refresher.complete();
          // }
          this.presentAlert(
            "Server Message - Get User Push Notification Detail : " +
              JSON.stringify(err)
            //err.error.SystemMessage
          );
        }
      );
    });
  }
  @ViewChild(Content) content: Content;
  /*
  scrollTo(elementId: string) {
    let y = document.getElementById(elementId).offsetTop;
    this.content.scrollTo(0, y);
  }*/
  ngAfterViewInit() {
    this.content.ionScrollEnd.subscribe(data => {
      if (data.directionY == "down" && this.Notifications.length % 10 == 0) {
        this.currentIndex = this.currentIndex + 1;
        this.LoadMessage();
      }
    });
  }
  /*
  AddFromEvents() {
    this.events.subscribe("NotificationDetail", lstPushNotificationDetail => {
      let _Notifications = lstPushNotificationDetail.filter(
        q => q.IsRead == false
      );
      for (var i = 0; i < _Notifications.length; i++) {
        _Notifications[i].showfull = false;
        if (_Notifications[i].Message.length <= 55) {
          _Notifications[i].HideButton = true;
        }

        if (
          this.Notifications.filter(q => q.Id !== _Notifications[i].Id)
            .length == 0
        ) {
          console.log(
            _Notifications[i].Id,
            "current Id not found - add in list"
          );
          this.Notifications.push(_Notifications[i]);
        } else {
          console.log(
            _Notifications[i].Id,
            "current Id found - not add in list"
          );
        }
      }
      // if (_Notifications.length > 0) {
      //   this.MarkMessageRead();
      // }
    });
  }
  */
  // MarkMessageRead(item: any) {
  //   if (!item.IsRead) {
  //     const userAcc = {
  //       DeviceId: localStorage.getItem("deviceid"),
  //       SecretToken: localStorage.getItem("SecretToken"),
  //       Id: item.Id
  //     };
  //     this.notificationService
  //       .UpdateIsReadPushNotificationDetail(userAcc)
  //       .subscribe(
  //         (resp: any) => {
  //           console.log("Marked user read data");
  //           item.IsRead = true;
  //         },
  //         err => {
  //           this.loader.dismiss();
  //           this.presentAlert(
  //             "Server Message - Update Is Read Push Notification Detail : " +
  //               err.error.SystemMessage
  //           );
  //         }
  //       );
  //   }
  // }

  OpenArticle(article, showfull) {
    // if (showfull) {
    //   article.showfull = false;
    // } else {
    //   article.showfull = true;
    // }
    localStorage.setItem("noti-item", JSON.stringify(article));
    article.IsRead = true;
    localStorage.setItem("currentIndex", this.currentIndex);
    this.navCtrl.push(NotificationMsgPage);
  }
  removeItem(item) {
    this.currentIndex = 1;
    let ids = [];
    ids.push(item.Id);
    this.deleteMessage(ids);
  }
  clearall() {
    this.currentIndex = 1;
    let ids = [];
    for (var i = 0; i < this.Notifications.length; i++) {
      ids.push(this.Notifications[i].Id);
    }
    if (ids.length > 0) this.deleteMessage(ids);
  }
  deleteMessage(lstIds) {
    const userAcc = {
      DeviceId: localStorage.getItem("deviceid"),
      SecretToken: localStorage.getItem("SecretToken"),
      Ids: lstIds
    };
    console.log(userAcc);

    this.loader = this.loadingCtrl.create({
      content: "Removing message..."
    });
    this.loader.present().then(() => {
      this.notificationService
        .DeleteUserPushNotificationDetail(userAcc)
        .subscribe(
          (resp: any) => {
            this.loader.dismiss();
            this.LoadMessage();
            console.log(this.Notifications);
          },
          err => {
            this.loader.dismiss();
            this.presentAlert(
              "Server Message - Delete User Push Notification Detail : " +
                JSON.stringify(err)
            );
          }
        );
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

  goBack() {
    this.navCtrl.setRoot(MyWellnessWalletPage);
  }
}
