import 'rxjs/add/operator/toPromise';

import { Injectable } from '@angular/core';
import { Api } from '../api/api';

@Injectable()
export class UserService {
  _user: any;

  
    
  constructor(public api: Api
    ) { }

  /**
   * Send a POST request to our login endpoint with the data
   * the user entered on the form.
   */
  login(accountInfo: any) {
    localStorage.setItem('Password',accountInfo.Password);
    localStorage.setItem('UserName',accountInfo.UserName);
    let seq = this.api.post('api/WellnessAPI/UserLogin', accountInfo).share();
    seq.subscribe((res: any) => {
       //console.log("*********");
       console.log(res); 
      // If the API returned a successful response, mark the user as logged in
      if(res.SystemStatus == "Success")
      {
        this._loggedIn(res);
      }
      
    }, err => {
      console.log('ERROR', err);
      
    //   alert("call provider error " + err );
    //   for(var key in err) {
    //     alert('call provider error  : key: ' + key + '\n' + 'value: ' + err[key]);
    // }
    });

    return seq;
  }

  

  // Get Bio age/ reward points and mhrscore
  getUserData(accountInfo: any) {
    let seq = this.api.post('api/WellnessAPI/GetUserData', accountInfo).share();

    seq.subscribe((res: any) => {

    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  /**
   * Send a POST request to our signup endpoint with the data
   * the user entered on the form.
   */
  signup(accountInfo: any) {
    let seq = this.api.post('api/WellnessAPI/AppUserRegister', accountInfo).share();

    seq.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in
        this._loggedIn(res);
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  forgetpassword(accountInfo: any) {
    let seq = this.api.post('api/WellnessAPI/UserForgotPassword', accountInfo).share();

    seq.subscribe((res: any) => {
     
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  SaveUserAgreeTermsCondition(accountInfo: any) {
    let seq = this.api.post('api/WellnessAPI/SaveUserAgreeTermsCondition', accountInfo).share();
    seq.subscribe((res: any) => { }, err => {
      console.error('ERROR', err);
    });
    return seq;
  }

  SaveUserTokenIdData(accountInfo: any) {
    let seq = this.api.post('api/WellnessAPI/SaveUserTokenIdData', accountInfo).share();
    seq.subscribe((res: any) => {  
      //alert('success in service')   
    }, err => {
      console.error('ERROR', err);
      //alert('error is service');
    });
    return seq;
  }

  SaveUserPushNotificationOnOff(accountInfo: any) {
    let seq = this.api.post('api/WellnessAPI/SaveUserPushNotificationOnOff', accountInfo).share();
    seq.subscribe((res: any) => {    }, err => {
      console.error('ERROR', err);
    });
    return seq;
  }

  GetUserPushNotificationDetail(accountInfo: any) {
    let seq = this.api.post('api/WellnessAPI/GetUserPushNotificationDetail', accountInfo).share();
    seq.subscribe((res: any) => {
    }, err => {
      console.error('ERROR', err);
    });
    return seq;
  }

  GetPushNotificationCount(accountInfo: any) {
    let seq = this.api.post('api/WellnessAPI/GetPushNotificationCount', accountInfo).share();
    seq.subscribe((res: any) => {
    }, err => {
      console.error('ERROR', err);
    });
    return seq;
  }

  /**
   * Send a POST request to our signup endpoint with the data
   * the user entered on the form.
   */
  checkEmailExist(accountInfo: any) {
    let seq = this.api.post('api/WellnessAPI/IsOnboardUserEmailExists', accountInfo).share();
    seq.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in
        this._loggedIn(res);
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }
  /**
   * Log the user out, which forgets the session
   */
  // logout() {
  //   this._user = null;
  //   localStorage.clear();
  // }

  /**
   * Process a login/signup response to store user data
   */
  _loggedIn(resp) {
    localStorage.setItem('UserInfo', JSON.stringify(resp));
    localStorage.setItem('FirstName',resp.FirstName);
    localStorage.setItem('LastName',resp.LastName);
    localStorage.setItem('SecretToken',resp.SecretToken);

    localStorage.setItem('ProfileImage',resp.ProfileImage);
    localStorage.setItem('RewardPoint',resp.RewardPoint);
    localStorage.setItem('bio_age',resp.bio_age);
    localStorage.setItem('mhrs_score',resp.mhrs_score);
    //localStorage.setItem('SecretToken','77d344e9-dbcb-4975-a76a-ab8a8256c624');
    localStorage.setItem('Gender',resp.Gender);
    localStorage.setItem('Height',resp.Height);
    localStorage.setItem('BirthDate',resp.BirthDate);

    localStorage.setItem('IsAgreeTermsCondition',resp.IsAgreeTermsCondition);
    localStorage.setItem('IsHRACompleted',resp.IsHRACompleted);
    localStorage.setItem('UserAccessLevel',resp.UserAccessLevel);
    localStorage.setItem('PushNotificationYesNo',resp.PushNotificationYesNo);
    
  //   this.uniqueDeviceID.get()
  // .then((uuid: any) => localStorage.setItem('deviceid',uuid))
  // .catch((error: any) => console.log(error));
    

    this._user = resp;
  }

  _LogoutUser()
  {
    let remuser = localStorage.getItem("remuser");
    let rempwd = localStorage.getItem("rempwd");
    let remUUID = localStorage.getItem("remUUID");

    let token = localStorage.getItem("FCMToken");
    let deviceType = localStorage.getItem("DeviceType");
   
    
    localStorage.clear();


    localStorage.setItem("FCMToken", token);
    localStorage.setItem("DeviceType", deviceType);
    localStorage.setItem("remUUID", remUUID);
    localStorage.setItem("remuser", remuser);
    localStorage.setItem("rempwd", rempwd);
    localStorage.setItem("deviceid", remUUID);
    
  }
}
