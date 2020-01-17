import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";

/**
 * Generated class for the IntroPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-template",
  templateUrl: "template.html"
})
export class TemplatePage {
  TempaletName: string;
  Title: string;
  loader: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.TempaletName = this.navParams.get("Content");
    if (this.TempaletName == "MHRScore") {
      this.Title = "MHR Score";
    } else if (this.TempaletName == "BioAge") {
      this.Title = "Bio Age";
    } else if (this.TempaletName == "TermsAndConditions") {
      this.Title = "Terms And Conditions";
    }
    else if (this.TempaletName == "PrecautionsandDisclaimer") {
      this.Title = "Precautions and Disclaimer";
    }
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad TemplatePage");
  }
}
