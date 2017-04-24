import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the Result page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
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
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.result = navParams.get('result');
    this.distance = navParams.get('distance');
    this.time = navParams.get('time');
    this.origin = navParams.get('origin');
    this.destination = navParams.get('destination');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Result');
  }

  back() {

  }
}
