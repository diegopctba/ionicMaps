import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';


@Component({
  selector: 'page-result',
  templateUrl: 'result.html',
})
export class ResultPage {

  result: Array<String>;
  distance: number;
  time: number;
  origin: string;
  destination: string
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public toastCtrl: ToastController) {
    this.result = navParams.get('result');
    this.distance = navParams.get('distance');
    this.time = navParams.get('time');
    this.origin = navParams.get('origin');
    this.destination = navParams.get('destination');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Result');
  }

  showDetail(messageToast) {
    let toast = this.toastCtrl.create({
      message: messageToast.toUpperCase(),
      position: 'middle',
      duration: 2500
    });
    toast.present();
  }
}
