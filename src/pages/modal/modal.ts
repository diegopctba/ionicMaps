import { Component, ViewChild } from '@angular/core';
import { NavParams, LoadingController, ViewController, Searchbar } from 'ionic-angular';

declare var google;

@Component({
  templateUrl: 'modal.html',
  selector: 'modal'
})
export class SearchPlace {

  @ViewChild('searchbar') searchbar: Searchbar;
  textField: string;
  bounds: any;
  inputOrder: any;
  listAddress: Array<String>;
  selected: string;

  constructor(params: NavParams, public viewCtrl: ViewController, public loadingCtrl: LoadingController) {
    var text = params.get('text');
    this.selected = '';
    this.listAddress = new Array<String>();
    this.bounds = params.get('bounds');
    this.inputOrder = params.get('inputOrder');
    if (text != undefined && text !== null) {
      this.textField = text;
      this.onInput();
    } else {
      this.textField = '';
    }
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.searchbar.setFocus();
    });
  }

  onInput() {
    this.listAddress = new Array<String>();
    let listAux = this.listAddress;
    let places = new google.maps.places.AutocompleteService();
    /*let loader = this.loadingCtrl.create({
      spinner: 'dots',
      showBackdrop: false
    });*/
    setTimeout(() => {
      this.listAddress = listAux;
      //this.searchbar.setFocus();
      //loader.dismiss();
    },500);
    if (this.textField != undefined && this.textField !== null && this.textField.length >= 3) {
      //loader.present();
      var input = { 'input': this.textField, 'location': null, 'radius': null };
      if (this.bounds !== undefined && this.bounds !== null) {
        input.location = this.bounds;
        input.radius = 100;
      }
      places.getPlacePredictions(input, function (results, status) {
        console.log(status);
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          results.forEach(address => {
            listAux.push(address.description);
          });
        }
       // loader.dismiss();
      }, (err) => {
        console.log(err);
      });
    }
  }

  clearSearch() {
    this.listAddress = new Array<String>();
  }

  select(selected) {
    this.selected = selected;
    let response = {
      'selected': selected,
      'inputOrder': this.inputOrder
    }
    this.viewCtrl.dismiss(response);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
