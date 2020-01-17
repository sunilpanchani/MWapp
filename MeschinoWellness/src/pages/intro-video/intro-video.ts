import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { MyHraPage } from '../my-hra/my-hra';

/**
 * Generated class for the IntroVideoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-intro-video',
  templateUrl: 'intro-video.html',
})
export class IntroVideoPage {
  @ViewChild('videoPlayer') mVideoPlayer: any;
   video:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public menu : MenuController) {
  }

  ionViewDidLoad() {
    this.video = this.mVideoPlayer.nativeElement;
    this.video.play();

    console.log('ionViewDidLoad IntroVideoPage');
  }
 
  goToMyHra() {
   this.video.pause();
   this.menu.enable(true);
    this.navCtrl.push(MyHraPage);
  }

}
