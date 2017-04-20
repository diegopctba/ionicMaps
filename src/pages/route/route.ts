import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, ModalController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { SearchPlace } from '../modal/modal';

declare var google;
/**
 * Generated class for the Route page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-route',
  templateUrl: 'route.html',
})
export class RoutePage {

  listAddress: Array<String>;
  origin: String;
  destination: String;
  waypoints: Array<{ location: string }>;
  result: Array<String>;
  sameDestination: boolean;
  bounds: any;
  time: number;
  distance: number;
  private oldDestination: String;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController
    , public toastCtrl: ToastController, public geoLocation: Geolocation, public modalCtrl: ModalController) {
    this.waypoints = [];
    this.origin = '';
    this.listAddress = new Array<String>();
    this.result = new Array<String>();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Route');
  }

  private validate() {
    var valid = false;
    valid = (this.origin.trim().length < 3 || this.destination.trim().length < 3);
    this.waypoints.forEach(points => {
      valid = (points.location.trim().length < 3);
    });
    if (valid) {
      this.presentToast('Informe os campos corretamente', 'middle');
    }
    return valid;
  }

  routing() {
    if (this.validate()) {
      return null;
    }

    let loader = this.loadingCtrl.create({
      content: 'Calculando rota...',
      duration: 3000,
      spinner: 'dots'
    });
    loader.present();
    var directionsService = new google.maps.DirectionsService();

    var directions = {
      origin: this.origin.trim(),
      destination: this.destination.trim(),
      optimizeWaypoints: true,
      travelMode: google.maps.DirectionsTravelMode.DRIVING,
      waypoints: null
    }
    if (this.waypoints.length > 0) {
      directions.waypoints = this.waypoints;
    }

    this.result = new Array<String>();
    this.distance = 0;
    var route = this.result;
    let message;
    let distance = this.distance;
    let time = this.time;
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
        var time = 0;
        var legs = response.routes[0].legs;
        for (var i = 0; i < legs.length; i++) {
          distance += legs[i].distance.value;
          time += legs[i].duration.value;
        }
        console.log((distance / 1000) + 'kms em ' + (time/3600) + 'hrs');
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
      this.presentToast("Limite máximo de pontos foi atingido...", 'top');
    } else {
      this.waypoints.push({ 'location': '' });
    }
  }

  remove() {
    if (this.waypoints.length <= 0) {
      this.presentToast("Limite mínimo de pontos foi atingido...", 'top');
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

  private presentToast(messageToast, position) {
    if (position === undefined) {
      position = 'top';
    }
    let toast = this.toastCtrl.create({
      message: messageToast,
      position: position,
      duration: 1500
    });
    toast.present();
  }

  hasResult() {
    return (this.result !== null && this.result.length > 0);
  }


  ionViewWillEnter() {
    this.getCurrentPostion();
  }

  private getCurrentPostion() {
    if (this.bounds === undefined || this.bounds === null) {
      this.geoLocation.getCurrentPosition().then((position) => {
        console.log('posicao gps ' + position);
        this.bounds = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      }, (err) => {
        console.log(err);
      });
    }
  }


  showModal(field) {
    var text;
    if (field === 'origin') {
      text = this.origin;
    } else if (field === 'destination') {
      text = this.destination;
    } else {
      text = this.waypoints[field].location;
    }
    let searchModal = this.modalCtrl.create(SearchPlace, {
      text: text,
      bounds: this.bounds,
      inputOrder: field
    });
    searchModal.onDidDismiss(response => {
      if (response !== undefined && response !== null) {
        var order = response.inputOrder;
        if (order === 'origin') {
          this.origin = response.selected;
        } else if (order === 'destination') {
          this.destination = response.selected;
        } else {
          this.waypoints[order].location = response.selected;
        }
      }
    });
    searchModal.present();
  }


}
