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
  geocoder: any;
  address: string;
  constructor(public navCtrl: NavController, public geolocation: Geolocation) {

  }

  ionViewWillEnter() {
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

  }


  loadMap() {
    console.log('iniciando');
    this.geolocation.getCurrentPosition().then((position) => {
      console.log('posicao gps ' + position);
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      this.geocoder = new google.maps.Geocoder();
      console.log('position original ' + this.map.latLng);

    }, (err) => {
      console.log(err);
    });

  }


  searchLocal() {
    // google.maps.event.addListener(this.address, 'change', () => {
    var latLng;
    var infoWindow = new google.maps.InfoWindow({ map: this.map });
    //let map = this.map;
    this.geocoder.geocode({ 'address': this.address }, function (results, status, map) {
      if (status === 'OK') {

        console.log('center original ' + this.map.center);
        latLng = results[0].geometry.location;
        // this.map.center = this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(this.map);
        /*        this.map.center = latLng;
                this.map.position = latLng;
                this.map.zoom = 15;
                console.log('bounds '+this.map.bounds);
                this.map.mapTypeId = google.maps.MapTypeId.ROADMAP
        */
        infoWindow.setPosition(latLng);
        //infoWindow.setZoom(8);
        //infoWindow.setContent('Location found.');
        let marker = new google.maps.Marker({

          map: this.map,
          animation: google.maps.Animation.DROP,
          position: latLng,          
          title: this.address
        });
        marker.addListener('click', function () {
          this.infowindow.open(this.map, marker);
        });        //map.setCenter(latLng)

        //this.map.position = latLng;
        //this.map.center = latLng;

        //        let infoWindow = new google.maps.InfoWindow({
        //          position: latLng,
        //          content: 
        //        });
        //this.map.setOptions(mapOptions);
        //this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

        console.log('center searched ' + this.map.center);
        //        var loc = results[0].geometry.location;
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
      }
    });
    console.log('position after ' + this.map.position);
    console.log('center after ' + this.map.center);
    console.log('latLng after ' + latLng);
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