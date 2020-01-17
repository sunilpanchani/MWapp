import { Injectable } from "@angular/core";
import { Firebase } from "@ionic-native/firebase";
import { Platform } from "ionic-angular";
import { AngularFirestore } from "angularfire2/firestore";

import { Observable } from "rxjs";

@Injectable()
export class FcmService {
  constructor(
    private firebase: Firebase,
    private afs: AngularFirestore,
    private platform: Platform
  ) {}

  deleteToken() {
    this.firebase.unregister();
  }

  async getToken(userId) {
    let token;
    let deviceType;
    if (this.platform.is("android")) {
      deviceType = "android";
      token = await this.firebase.getToken();
      //alert(token);
    }

    if (this.platform.is("ios")) {
      deviceType = "ios";
      token = await this.firebase.getToken();
      //alert(token);
      await this.firebase.grantPermission();
    }
    localStorage.setItem("FCMToken", token);
    localStorage.setItem("DeviceType", deviceType);
    this.saveToken(token, userId);
  }

  private saveToken(token, userId) {
    if (!token) return;
    const devicesRef = this.afs.collection("devices");
    const data = {
      token,
      userId: userId
    };
    return devicesRef.doc(token).set(data);
  }
  onNotifications() {
    return this.firebase.onNotificationOpen();
  }
}
