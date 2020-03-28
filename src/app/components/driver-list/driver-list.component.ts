import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user-service/user.service';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { Batch } from 'src/app/models/batch';
import { Car } from 'src/app/models/car';
import { CarService } from 'src/app/services/car-service/car.service';
import { Router } from '@angular/router';
import { BatchService } from 'src/app/services/batch-service/batch.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-driver-list',
  templateUrl: './driver-list.component.html',
  styleUrls: ['./driver-list.component.css']
})
export class DriverListComponent implements OnInit {

  location: string = 'Morgantown, WV';
  mapProperties: {};
  availableCars: Array<any> = [];
  drivers: Array<any> = [];


  @ViewChild('map', null) mapElement: any;
  map: google.maps.Map;

  constructor(private http: HttpClient, private userService: UserService) { }

  ngOnInit() {
    this.drivers = [];

    this.userService.getRidersForLocation1(this.location).subscribe(
      res => {
        //console.log(res);
        res.forEach(element => {
          this.drivers.push({
            'id': element.userId,
            'name': element.firstName + " " + element.lastName,
            'origin': element.hCity + "," + element.hState,
            'email': element.email,
            'phone': element.phoneNumber,
            'ride': { distance: 0, duration: 0 }
          });
        });
      });
    /*this.drivers.push({'id': '1','name': 'Ed Ogeron','origin':'Reston, VA', 'email': 'ed@gmail.com', 'phone':'555-555-5555'});
    this.drivers.push({'id': '2','name': 'Nick Saban','origin':'Oklahoma, OK', 'email': 'nick@gmail.com', 'phone':'555-555-5555'});
    this.drivers.push({'id': '3','name': 'Bobbie sfsBowden','origin':'Texas, TX', 'email': 'bobbie@gmail.com', 'phone':'555-555-5555'});
    this.drivers.push({'id': '4','name': 'Les Miles','origin':'New York, NY', 'email': 'les@gmail.com', 'phone':'555-555-5555'});
    this.drivers.push({'id': '5','name': 'Bear Bryant','origin':'Arkansas, AR', 'email': 'bear@gmail.com', 'phone':'555-555-5555'});*/
    //console.log(this.drivers);
    this.getGoogleApi();

    this.sleep(2000).then(() => {
      this.mapProperties = {
        center: new google.maps.LatLng(Number(sessionStorage.getItem("lat")), Number(sessionStorage.getItem("lng"))),
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      this.map = new google.maps.Map(this.mapElement.nativeElement, this.mapProperties);
      //get all routes 
      this.displayDriversList(this.location, this.drivers);
      //show drivers on map
      this.showDriversOnMap(this.location, this.drivers);
    });
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getGoogleApi() {
    this.http.get(`${environment.loginUri}getGoogleApi`)
      .subscribe(
        (response) => {
          //console.log(response);
          if (response["googleMapAPIKey"] != undefined) {
            new Promise((resolve) => {
              let script: HTMLScriptElement = document.createElement('script');
              script.addEventListener('load', r => resolve());
              script.src = `http://maps.googleapis.com/maps/api/js?key=${response["googleMapAPIKey"][0]}`;
              document.head.appendChild(script);
            });
          }
        }
      );
  }

  showDriversOnMap(origin, drivers) {
    drivers.forEach(element => {
      var directionsService = new google.maps.DirectionsService;
      var directionsRenderer = new google.maps.DirectionsRenderer({
        draggable: true,
        map: this.map
      });
      this.displayRoute(origin, element.origin, directionsService, directionsRenderer);
    });
  }


  displayRoute(origin, destination, service, display) {
    service.route({
      origin: origin,
      destination: destination,
      travelMode: 'DRIVING',
      //avoidTolls: true
    }, function (response, status) {
      if (status === 'OK') {
        display.setDirections(response);
      } else {
        alert('Could not display directions due to: ' + status);
      }
    });
  }


  displayDriversList(origin, drivers) {
    let origins = [];
    //set origin
    origins.push(origin)

    this.drivers = drivers.map(driver => {
      console.log(driver);
      var service = new google.maps.DistanceMatrixService;
      service.getDistanceMatrix({
        origins: origins,
        destinations: [driver.origin],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.IMPERIAL,
        avoidHighways: false,
        avoidTolls: false
      }, function (response, status) {
        if (status !== 'OK') {
          alert('Error was: ' + status);
        } else {
          // var results = response.rows[0].elements;
          // let distance = results[0].distance.text;
          // let duration = results[0].duration.text;
          // driver['ride'] = { distance: distance, duration: duration };
          console.log(response);
          return driver;
        }
      });
    });
    console.log(this.drivers);
  }

}
