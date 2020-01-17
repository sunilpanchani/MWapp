import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the DashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mytracker',
  templateUrl: 'mytracker.html',
})
export class MyTrackerPage {
  account: { FirstName: string, LastName: string } = {
    FirstName: '',
    LastName: '',
  };  

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.account.FirstName = localStorage.getItem('FirstName');
    this.account.LastName = localStorage.getItem('LastName');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyTrackerPage');
  }

}
