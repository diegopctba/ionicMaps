import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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
  destin: String;
  waypoints: Array<String>;
  result: Array<String>;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.waypoints = new Array<String>();
    this.waypoints.push('');
    this.result = new Array<String>();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Route');
  }

  routing() {
    var directionsService = new google.maps.DirectionsService();
    var points = [];
    for (var index = 0; index < this.waypoints.length; index++) {
      //points += points + '{ \'locate\' :' + this.waypoints[index] + '},';
      points.push({
        'location': this.waypoints[index]
      });
    };
    var directions = {
      origin: this.origin,
      destination: this.destin,
      optimizeWaypoints: true,
      travelMode: google.maps.DirectionsTravelMode.DRIVING,
      waypoints: points
    }
    let origin = this.origin;
    let destin = this.destin;
    directionsService.route(directions, function (response, status) {
      console.log('status directions ' + status);
      if (status == 'OK') {
        let result = new Array<String>();
        var order = response.routes[0].waypoint_order;//[0,2,3,1]
        result.push(origin);
        for (var index = 0; index < order.length; index++) {
          var element = directions.waypoints[order[index]].location;
          console.log(index + ' ' + element);
          result.push(element);
        }
        result.push(destin);
        this.result = result;
      }
    });
    console.log('result '+this.result);
  }

  destinEqualsOrigin() {
    this.destin = this.origin;
  }

  back() {
    this.result = null;
  }

  add() {
    this.waypoints.push('');
  }

  remove() {
    this.waypoints.pop();
  }
}
