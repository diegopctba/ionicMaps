import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';

declare var google;
/**
 * Generated class for the Route page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-route',
  templateUrl: 'route.html',
})
export class RoutePage {

  origin: String;
  destination: String;
  waypoints: Array<{ location: string }>;
  result: Array<String>;
  sameDestination: boolean;
  private oldDestination: String;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController
    , public toastCtrl: ToastController) {
    this.waypoints = [];

    this.result = new Array<String>();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Route');
  }

  routing() {
    let loader = this.loadingCtrl.create({
      content: 'Calculando rota...',
      duration: 3000,
      spinner: 'dots'
    });
    loader.present();
    var directionsService = new google.maps.DirectionsService();

    var directions = {
      origin: this.origin,
      destination: this.destination,
      optimizeWaypoints: true,
      travelMode: google.maps.DirectionsTravelMode.DRIVING,
      waypoints: this.waypoints
    }

    this.result = new Array<String>();
    var route = this.result;
    let message;
    directionsService.route(directions, function (response, status) {
      console.log('status directions ' + status);
      if (status == 'OK') {
        var order = response.routes[0].waypoint_order;//[0,2,3,1]
        //route.push(origin);
        for (var index = 0; index < order.length; index++) {
          var element = directions.waypoints[order[index]].location;
          console.log(index + ' ' + element);
          route.push(element);
        }
        //route.push(destin);
        this.result = route;
      } else {
        if (status == 'NOT FOUND') {
          message = 'Rota não encontrada';
        }
      }
      loader.dismiss();
      
    });
    console.log('result ' + this.result);
  }

  destinationIsOrigin() {
    if (this.sameDestination) {
      this.oldDestination = this.destination;
      this.destination = this.origin.toUpperCase();
    } else {
      this.destination = this.oldDestination;
    }
  }

  back() {
    this.result = null;
  }

  add() {
    if (this.waypoints.length > 21) {
      this.presentToast("Limite máximo de pontos foi atingido...");
    } else {
      this.waypoints.push({ 'location': '' });
    }
  }

  remove() {
    if (this.waypoints.length <= 0) {
      this.presentToast("Limite mínimo de pontos foi atingido...");
    } else {
      this.waypoints.pop();
    }
  }

  clear() {
    this.waypoints = [];
    this.origin = '';
    this.destination = '';
    this.oldDestination = '';
    this.result = null;
  }

  private presentToast(messageToast) {
    let toast = this.toastCtrl.create({
      message: messageToast,
      position: 'top',
      duration: 1500
    });
    toast.present();
  }

  hasResult() {
    return (this.result !== null && this.result.length > 0);
  }
}
