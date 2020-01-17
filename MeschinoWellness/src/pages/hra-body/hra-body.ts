import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserService } from '../../providers';
import { WellnessConstants } from '../../providers/settings/wellnessconstant';

/**
 * Generated class for the HraBodyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-hra-body',
  templateUrl: 'hra-body.html',
})
export class HraBodyPage {

  account :  { 
    deviceid: string;
    SecretToken: string;
    pounds: number , inches: number } = {
    pounds: 150,
    inches: 38,
    deviceid: "",
    SecretToken: ""
  };
  weightData:any;
  waistData:any;

  loader: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.waistData = WellnessConstants.waistData;
    this.weightData = WellnessConstants.weightData;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HraBodyPage');
  }
  submit()
  {
    
  }
}
