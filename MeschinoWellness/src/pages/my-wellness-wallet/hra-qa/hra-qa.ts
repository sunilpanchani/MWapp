import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  LoadingController
} from "ionic-angular";
import { HraService } from "../../../providers";
import { NgForm } from "@angular/forms";
import { MyHraResultPage } from "../hra-result/hra-result";

@IonicPage()
@Component({
  selector: "page-hra-qa",
  templateUrl: "hra-qa.html"
})
export class HraQaPage {
  account: {
    deviceid: string;
    SecretToken: string;
    report_section_num: number;
    lst_hra_response: any;
  } = {
    deviceid: "",
    SecretToken: "",
    report_section_num: 0,
    lst_hra_response: []
  };
  HraQuestion: [{ hraAnswer: any }] = [{ hraAnswer: [] }];
  loader: any;
  HraDetailQuestionList: any = { lst_hra_question: [] };
  weightData: any;
  waistData: any;
  cardData: any;
  nextCardIndex: number;

  HraDetailSections: any;
  RiskReportDetails: any;
  FormSectionData: [{ answer: number }] = [{ answer: 0 }];
  resetFlg: boolean = false;
  hideQuestion: [{ check: boolean }] = [{ check: true }];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public hraApi: HraService,
    public alertCtl: AlertController,
    public loadingCtrl: LoadingController,
    public form: NgForm
  ) {
    this.cardData = this.navParams.get("cardData");
    this.nextCardIndex = this.navParams.get("nextCardIndex");
    this.resetFlg = this.navParams.get("resetFlg");
    this.RiskReportDetails = JSON.parse(
      localStorage.getItem("RiskReportDetails")
    );

    this.HraDetailSections = JSON.parse(
      localStorage.getItem("HraDetailSections")
    );

    // if (this.HraDetailSections.length > 0) {
    // }

    if (this.resetFlg) {
      this.FormSectionData = [{ answer: 0 }];
    } else {
      for (let Data in this.RiskReportDetails) {
        let temp: any = {
          answer: this.RiskReportDetails[Data].answer_num || 0
        };
        let temBool: any = { check: false };
        this.FormSectionData[this.RiskReportDetails[Data].question_num] = temp;
        this.hideQuestion[this.RiskReportDetails[Data].question_num] = temBool;
      }
    }

    console.log(this.nextCardIndex, "nextCardIndex");
    this.loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    this.RiskReportDetails = JSON.parse(
      localStorage.getItem("RiskReportDetails")
    );
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad HraBodyPage");
    this.GetSectionDataBySection();
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
  async presentAlertRedirect(msg) {
    const alert = await this.alertCtl.create({
      message: msg,
      cssClass: "action-sheets-basic-page"
    });
    // code for hide
    await alert.present().then(() => {
      // hide the alert after 2 sec
      setTimeout(() => {
        alert.dismiss();
        this.goToHraDetail(
          this.HraDetailSections[this.nextCardIndex],
          this.nextCardIndex + 1
        );
      }, 2000);
    });
    // code for hide
  }
  async presentAlertLastRedirect(msg) {
    const alert = await this.alertCtl.create({
      message: msg,
      cssClass: "action-sheets-basic-page"
    });
    await alert.present().then(() => {
      // hide the alert after 2 sec
      setTimeout(() => {
        alert.dismiss();
        this.navCtrl.setRoot(MyHraResultPage);
      }, 2000);
    });
  }
  public submitLastSection() {
    var ansData: any = [];
    for (let Data in this.HraDetailQuestionList.lst_hra_question) {
      let questionNumber = this.HraDetailQuestionList.lst_hra_question[Data]
        .question_num;
      if (this.FormSectionData[questionNumber]) {
        ansData.push({
          QuestionNum: questionNumber,
          AnswerNum: this.FormSectionData[questionNumber].answer
        });
      }
    }
    this.account.deviceid = localStorage.getItem("deviceid");
    this.account.SecretToken = localStorage.getItem("SecretToken");
    this.account.lst_hra_response = ansData;
    this.loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    this.loader.present().then(() => {
      this.hraApi.SaveHRAResponse(this.account).subscribe(
        (res: any) => {
          console.log(res);
          this.loader.dismiss();
          this.presentAlertLastRedirect(
            this.cardData.description + " section data saved successfully."
          );
        },
        err => {
          this.loader.dismiss();
          this.presentAlert("Save HRA Response - " +
          JSON.stringify(err)
           //err.error.SystemMessage
           );
        }
      );
    });
  }
  public submitSection() {
    var ansData: any = [];
    for (let Data in this.HraDetailQuestionList.lst_hra_question) {
      let questionNumber = this.HraDetailQuestionList.lst_hra_question[Data]
        .question_num;
      if (
        (questionNumber == 277 || questionNumber == 278) &&
        this.FormSectionData[questionNumber]
      ) {
        console.log("current question ", questionNumber);
        ansData.push({
          QuestionNum: questionNumber,
          AnswerNum: this.GetBodyMetricsAnswerValue(
            questionNumber,
            this.FormSectionData[questionNumber].answer
          )
        });
      } else if (this.FormSectionData[questionNumber]) {
        ansData.push({
          QuestionNum: questionNumber,
          AnswerNum: this.FormSectionData[questionNumber].answer
        });
      }
    }
    if (ansData.length > 0) {
      this.account.deviceid = localStorage.getItem("deviceid");
      this.account.SecretToken = localStorage.getItem("SecretToken");
      this.account.lst_hra_response = ansData;
      console.log(ansData, "ansData");
      this.loader = this.loadingCtrl.create({
        content: "Please wait..."
      });
      this.loader.present().then(() => {
        this.hraApi.SaveHRAResponse(this.account).subscribe(
          (res: any) => {
            this.loader.dismiss();
            this.presentAlertRedirect(
              this.cardData.description + " section data saved successfully."
            );
          },
          err => {
            this.loader.dismiss();
            console.error("ERROR", err);
            this.presentAlert("Save HRA Response - " + 
            JSON.stringify(err)
            //err.error.SystemMessage
            );
          }
        );
      });
    } else {
      this.presentAlert(this.cardData.description + " Answer not selected ");
    }
  }
  goToHraDetail(cardData: any, nextCardIndex: any) {
    this.navCtrl.push(HraQaPage, {
      cardData: cardData,
      nextCardIndex: nextCardIndex
    });
  }
  GetSectionDataBySection() {
    this.account.deviceid = localStorage.getItem("deviceid");
    this.account.SecretToken = localStorage.getItem("SecretToken");
    this.account.report_section_num = this.cardData.report_section_num;

    this.loader.present().then(() => {
      this.hraApi.GetHRAQuestionDetails(this.account).subscribe(
        resp => {
          this.loader.dismiss();
          this.HraDetailQuestionList = resp;
          // console.log("resp", resp);
          for (let Data in this.HraDetailQuestionList.lst_hra_question) {
            let questionNumber = this.HraDetailQuestionList.lst_hra_question[
              Data
            ].question_num;
            if (!this.FormSectionData[questionNumber]) {
              let temp: any = {
                answer: this.HraDetailQuestionList.lst_hra_question[Data]
                  .hra_answer[0].answer_num
              };
              this.FormSectionData[questionNumber] = temp;
              let temBool: any = { check: false };
              this.hideQuestion[questionNumber] = temBool;
            }
            this.GetCorrectAnswer(Data, questionNumber);
          }
          this.InitialSupressQuestion();
        },
        err => {
          this.loader.dismiss();
          // Unable to log in
          this.presentAlert(
            "Get HRA Question Details " + 
            JSON.stringify(err)
            //err.error.SystemMessage
          );
        }
      );
    });
  }

  GetCorrectAnswer(Data, queNo) {
    let questiondetails = this.HraDetailQuestionList.lst_hra_question.filter(
      q => q.question_num == queNo
    );
    if (questiondetails !== null && questiondetails.length > 0) {
      let ansdefault = questiondetails[0].hra_answer.filter(
        a => a.default_answer == true
      );
      if (ansdefault !== null) {
        this.FormSectionData[queNo].answer = ansdefault[0].answer_num;
      } else {
        this.FormSectionData[queNo].answer = 1;
      }
    } else {
    }
  }
  public InitialSupressQuestion() {
    console.log(this.HraDetailQuestionList, "this.HraDetailQuestionList ");

    var supressQuestionData = this.HraDetailQuestionList
      .lst_hra_question_suppress;
    var uniqueSupressQues = supressQuestionData
      .map(item => item.question_num)
      .filter((value, index, self) => self.indexOf(value) === index);
    console.log(uniqueSupressQues, "uniqueSupressQues");

    for (let que in uniqueSupressQues) {
      var ansdefault = this.GetAnswerValue(uniqueSupressQues[que]);
      let quesSupressInit = supressQuestionData.filter(
        q =>
          q.question_num == uniqueSupressQues[que] && q.answer_num == ansdefault
      );
      if (quesSupressInit !== null) {
        for (let supque in quesSupressInit) {
          this.hideQuestion[quesSupressInit[supque].question_num_suppress] = {
            check: true
          };
        }
      }
    }
  }

  public supressQuestion(qdata: any) {
    console.log(qdata, " qdata ");
    console.log(this.HraDetailQuestionList, "this.HraDetailQuestionList ");
    var supressQuestionData = this.HraDetailQuestionList
      .lst_hra_question_suppress;
    // console.log(supressQuestionData, ' supressQuestionData ')
    var uniqueSupressQues = supressQuestionData.filter(
      q => q.question_num == qdata.question_num
    );
    // console.log(uniqueSupressQues, 'uniqueSupressQues');
    var ansdefault = this.FormSectionData[qdata.question_num].answer;
    //console.log(this.FormSectionData, ' FormSectionData ')
    //console.log(ansdefault, ' ansdefault  supressQuestion ')
    // show all
    for (let que in uniqueSupressQues) {
      this.hideQuestion[uniqueSupressQues[que].question_num_suppress] = {
        check: false
      };
    }
    // now hide selected
    for (let que in uniqueSupressQues) {
      if (uniqueSupressQues[que].answer_num == ansdefault) {
        this.hideQuestion[uniqueSupressQues[que].question_num_suppress] = {
          check: true
        };
      }
    }
  }

  GetAnswerValue(queNo) {
    console.log(queNo, "queNo");
    let ansValue = 1;
    let questiondetails = this.HraDetailQuestionList.lst_hra_question.filter(
      q => q.question_num == queNo
    );
    if (questiondetails !== null && questiondetails.length > 0) {
      let ansdefault = questiondetails[0].hra_answer.filter(
        a => a.default_answer == true
      );
      ansValue = ansdefault !== null ? ansdefault[0].answer_num : 1;
      return ansValue;
    }
  }

  GetBodyMetricsAnswerValue(queNo, answer_num) {
    console.log(queNo, "GetBodyMetricsAnswerValue");
    let ansValue = answer_num;
    let questiondetails = this.HraDetailQuestionList.lst_hra_question.filter(
      q => q.question_num == queNo
    );
    if (questiondetails !== null && questiondetails.length > 0) {
      let ansoptions = questiondetails[0].hra_answer.filter(
        a => a.answer_num == answer_num
      );
      ansValue = ansoptions[0].answer;
      return ansValue;
    } else {
      return answer_num;
    }
  }
}
