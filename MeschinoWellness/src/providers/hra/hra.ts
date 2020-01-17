import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Api } from "../api/api";

/*
  Generated class for the HraProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class HraService {
  hraSections: any;
  hraQuestionDetail: any;
  hraResults: any;
  hraRiskReport: any;
  MajorHealthRisks : any;
  HealthRiskDetail : any;
  constructor(public http: HttpClient, public api: Api) {
    console.log("HraProvider Provider");
  }

  GetHraSections(accountInfo: any) {
    //this.api.url = "../../assets/data";
    let seq = this.api
      .post("api/WellnessAPI/GetHRASections", accountInfo)
      .share();

    seq.subscribe(
      (res: any) => {
        // If the API returned a successful response, mark the user as logged in
        this.hraSections = res;
      },
      err => {
        console.error("ERROR", err);
      }
    );
    return seq;
  }
  GetHRAQuestionDetails(accountInfo: any) {
    let seq = this.api
      .post("api/WellnessAPI/GetHRAQuestionDetailsBySection", accountInfo)
      .share();
    seq.subscribe(
      (res: any) => {
        // If the API returned a successful response, mark the user as logged in
        this.hraQuestionDetail = res;
      },
      err => {
        console.error("ERROR", err);
      }
    );
    return seq;
  }

  SaveHRAResponse(accountInfo: any) {
    let seq = this.api
      .post("api/WellnessAPI/SaveHRAResponse", accountInfo)
      .share();
    seq.subscribe(
      (res: any) => {
        // If the API returned a successful response, mark the user as logged in
        this.hraQuestionDetail = res;
      },
      err => {
        console.error("ERROR", err);
      }
    );
    return seq;
  }

  GetRiskReportNum(accountInfo: any) {
    let seq = this.api
      .post("api/WellnessAPI/EvaluateRiskReportAPI", accountInfo)
      .share();
    seq.subscribe(
      (res: any) => {
        // If the API returned a successful response, mark the user as logged in
        this.hraRiskReport = res;
      },
      err => {
        console.error("ERROR", err);
      }
    );
    return seq;
  }

  GetHraReport(accountInfo: any) {
    let seq = this.api
      .post("api/WellnessAPI/GetIdentifiedConditionsAPI", accountInfo)
      .share();
    seq.subscribe(
      (res: any) => {
        // If the API returned a successful response, mark the user as logged in
        this.hraResults = res;
      },
      err => {
        console.error("ERROR", err);
      }
    );
    return seq;
  }

  GetMajorHealthRisks(accountInfo: any) {
    let seq = this.api
      .post("api/WellnessAPI/GetMajorHealthRisks", accountInfo)
      .share();
    seq.subscribe(
      (res: any) => {
        // If the API returned a successful response, mark the user as logged in
        this.MajorHealthRisks = res;
      },
      err => {
        console.error("ERROR", err);
      }
    );
    return seq;
  }

  GetHealthRiskDetail(accountInfo: any) {
    let seq = this.api
      .post("api/WellnessAPI/GetHealthRiskDetail", accountInfo)
      .share();
    seq.subscribe(
      (res: any) => {
        // If the API returned a successful response, mark the user as logged in
        this.HealthRiskDetail = res;
      },
      err => {
        console.error("ERROR", err);
      }
    );
    return seq;
  }

}
