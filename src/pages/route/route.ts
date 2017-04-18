import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController,ModalController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

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

  listAddress: Array<String>;
  origin: String;
  destination: String;
  waypoints: Array<{ location: string }>;
  result: Array<String>;
  sameDestination: boolean;
  bounds: any;
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


  showModal() {
    console.log('showmodal');
    let modal = this.modalCtrl.create(SearchPlace, {
      text: this.origin,
      bounds: this.bounds
    });
    modal.present();
  }


}

@Component({
  templateUrl: 'modal.html',
  selector: 'modal'
})
export class SearchPlace {

  str: string;
  bounds: any;
  public listAddress: Array<String>;
  
  constructor(params: NavParams) {
    var text = params.get('text');
    if (text != undefined && text !== null) {
      this.str = text;
    }
    this.bounds = params.get('bounds');

  }

  onInput(ev: any) {
    this.listAddress = new Array<String>();
    var places = new google.maps.places.AutocompleteService();
    var text = ev.path[0].value;
    if (text != undefined && text !== null && text.length >= 3) {
      places.getPlacePredictions({ 'input': text, 'location': this.bounds, 'radius': 1000 }, function (results, status) {
        console.log(status);
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          results.forEach(address => {
            this.listAddress.push(address.description);
          });
        }
      }, (err) => {
        this.listAddress = new Array<String>();
      });
    }
  }

  clearSearch() {
    this.listAddress = new Array<String>();
  }

}
