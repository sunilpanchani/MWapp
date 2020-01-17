import "rxjs/add/operator/toPromise";

import { Injectable } from "@angular/core";
import { Api } from "../api/api";

@Injectable()
export class NotificationService {
  constructor(public api: Api) {}

  UpdateIsReadPushNotificationDetail(accountInfo: any) {
    let seq = this.api
      .post("api/WellnessAPI/UpdateIsReadPushNotificationDetail", accountInfo)
      .share();
    seq.subscribe(
      (res: any) => {},
      err => {
        console.error("ERROR", err);
      }
    );
    return seq;
  }

  DeleteUserPushNotificationDetail(accountInfo: any) {
    let seq = this.api
      .post("api/WellnessAPI/DeleteUserPushNotificationDetail", accountInfo)
      .share();
    seq.subscribe(
      (res: any) => {},
      err => {
        console.error("ERROR", err);
      }
    );
    return seq;
  }
}
