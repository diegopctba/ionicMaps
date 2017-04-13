import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

declare var google;

@Component({
  selector: 'home-page',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  address: string;
  constructor(public navCtrl: NavController, public geolocation: Geolocation) {

  }

  ionViewDidLoad() {
    this.loadMap();
  }


  initMap() {
    let latLng = new google.maps.LatLng(-34, 9290, 138.6010);
    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      google.maps.event.addDomListener(this.address, 'click', function() {
        var myLatlng = new google.maps.LatLng(37.3000, -120.4833);
 
        var mapOptions = {
            center: myLatlng,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
 
        var map = new google.maps.Map(this.map, mapOptions);
 
        /*navigator.geolocation.getCurrentPosition(function(pos) {
            map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            var myLocation = new google.maps.Marker({
                position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
                map: map,
                title: "My Location"
            });
        });*/
 
        this.map = map;
    });
  }


  loadMap() {

    this.geolocation.getCurrentPosition().then((position) => {

      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      
      console.log('position original ' + this.map.latLng);

    }, (err) => {
      console.log(err);
    });

  }


  searchLocal() {
    // google.maps.event.addListener(this.address, 'change', () => {
    let geocoder = new google.maps.Geocoder();let latLng;
    geocoder.geocode({ 'address': this.address }, function (results, status) {
      if (status === 'OK') {

        latLng = results[0].geometry.location;
        this.map.center = this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(this.map);

        /*let mapOptions = {
          center: latLng,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }*/
        //this.map.setOptions(mapOptions);
//        var loc = results[0].geometry.location;
        console.log('position original ' + this.map.position);
        /*let mapOptions = {
           center: loc,
           zoom: 15,
           mapTypeId: google.maps.MapTypeId.ROADMAP
         }*/
        //this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
        /*this.map.location = (latLng);
        this.map.center = (latLng);
        this.map.position = (latLnglatLng);
        this.map.panTo = (loc);
        this.map.mapTypeId = google.maps.MapTypeId.ROADMAP;
        this.map.zoom = 15;*/
        //this.addMarker();
        //add
        //              this.map.setCenter(results[0].geometry.location);
        /* var marker = new google.maps.Marker({
            map: this.map,
             position: results[0].geometry.location,
             zoom: 15
         });*/
        //let content = "<h4>Information!</h4>";
        //this.addInfoWindow(marker, content);
        console.log('position searched ' + this.map.position);
      }
    });
    this.map.setCenter(latLng);
        this.map.setZoom(15);
    //  });
  }

  addMarker() {

    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()
    });

    let content = "<h4>Information!</h4>";

    this.addInfoWindow(marker, content);

  }

  addInfoWindow(marker, content) {

    /* let geoLoc = new google.maps.geolocation({
       position: this.map.getCenter()
     });
   */
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });


  }


}