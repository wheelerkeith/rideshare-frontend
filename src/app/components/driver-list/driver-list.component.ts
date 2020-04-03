import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'src/app/services/user-service/user.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BatchService } from '../../services/batch-service/batch.service';
import { FilterService } from '../../services/filter-service/filter-service.service';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { User } from 'src/app/models/user';
import { Car } from 'src/app/models/car';



@Component({
  selector: 'app-driver-list',
  templateUrl: './driver-list.component.html',
  styleUrls: ['./driver-list.component.css']
})
export class DriverListComponent implements OnInit {

  currentUserId: number;
  location: string = 'Morgantown, WV';
  mapProperties: {};
  availableCars: Array<any> = [];
  drivers: Array<any> = [];
  batches: Array<any> = [];
  selectedBatch: number = 1;
  selectedFilters: Array<any> = [];
  geocoder: any;


  @ViewChild('map', null) mapElement: any;
  map: google.maps.Map;

  constructor(private http: HttpClient, private userService: UserService,
    private batchService: BatchService, private filterService: FilterService,
    private authService: AuthService) { }

  ngOnInit() {
    this.batches = this.batchService.getAllBatches();
    this.getGoogleApi();
    this.currentUserId = JSON.parse(sessionStorage.getItem("userid"));
    

    this.sleep(2500).then(() => {
      this.mapProperties = {
        center: new google.maps.LatLng(Number(sessionStorage.getItem("lat")), Number(sessionStorage.getItem("lng"))),
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      this.geocoder = new google.maps.Geocoder;
      this.map = new google.maps.Map(this.mapElement.nativeElement, this.mapProperties);

      this.drivers = [];

      this.filterService.getFilteredDrivers(this.selectedFilters, this.currentUserId, this.selectedBatch).subscribe(
        (res: Array<User>) => {
          console.log(this.selectedFilters, this.currentUserId, this.selectedBatch);
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
          //get all routes 
          this.displayDriversList();
          //show drivers on map
          this.showDriversOnMap(this.location, this.drivers);
        });
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

  displayDriversList() {
    let origins = [];
    //set origin
    origins.push(this.location)
    for (let driver of this.drivers) {
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
          let results = response.rows[0].elements;
          let distance = results[0].distance.text;
          let duration = results[0].duration.text;
          driver.ride = { distance: distance, duration: duration };
          driver.car = new Car();
          driver.car.seats = 4;
        }
      });
    }
  }

  filterDrivers() {
    this.filterService.getFilteredDrivers(this.selectedFilters, this.currentUserId, this.selectedBatch)
      .subscribe((res:User[]) => {
        res.forEach((element, index) => {
          this.drivers[index] = {
            'id': element.userId,
            'name': element.firstName + " " + element.lastName,
            'origin': element.hCity + "," + element.hState,
            'email': element.email,
            'phone': element.phoneNumber,
            'ride': { distance: 0, duration: 0 }
          };
        });
        this.displayDriversList();
        this.showDriversOnMap(this.location, this.drivers);
      });
  }
}
