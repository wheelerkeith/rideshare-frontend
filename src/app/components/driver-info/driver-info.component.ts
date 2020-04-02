import { Component, OnInit } from '@angular/core';
import { CarService } from 'src/app/services/car-service/car.service';
import { Car } from 'src/app/models/car';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { Router } from '@angular/router';
import { BatchService } from 'src/app/services/batch-service/batch.service';
import { Batch } from 'src/app/models/batch';
import { UserService } from 'src/app/services/user-service/user.service';
import { User } from 'src/app/models/user';


@Component({
  selector: 'app-driver-info',
  templateUrl: './driver-info.component.html',
  styleUrls: ['./driver-info.component.css']
})

/**
 * The DriverInfo component
 */

export class DriverInfoComponent implements OnInit {

  /**
   * Sets all variables
   */

  batches: Batch[] = [];
  allAvailableDrivers: User[] = [];
  availableDrivers: User[] = [];

  /**
   * Set order year as a boolean false
   */

  orderYear: boolean = false;

  /**
   * Set order first name as a boolean false
   */
  orderFirstName: boolean = false;

  /**
   * Set search name field as a string
   */

  searchName: string = '';

  /**
   * Set search location as a string
   */
  searchLocation: string = '';

  noUserFound: boolean = false;
  /**
   * A constructor
   * @param carService A car service is injected.
   * @param authService An auth service is injected.
   * @param router  A router service is injected.
   * @param batchService A batch service is injected.
   */

  constructor(private carService: CarService, private userService: UserService, private authService: AuthService, private router: Router, private batchService: BatchService) { }

  /**
   * This function sets the component
   */
  ngOnInit() {
    let userId = this.authService.user.userId;
    if (!userId) {
      this.router.navigate(['']);
    } else {
      this.userService.getAllUsers().subscribe(
        data => {
          this.allAvailableDrivers = data.filter(user => user.isAcceptingRides && user.active);
          this.orderByLocation();
        }
      )
      this.batches = this.batchService.getAllBatches();
    }
  }

  /**
   * A function the sorts the car object by batch location
   */

  orderByLocation() {
    let userLocation = this.authService.user.batch.batchLocation;

    this.allAvailableDrivers.sort((a, b) => a.batch.batchLocation > b.batch.batchLocation ? 1 : -1);
    this.allAvailableDrivers = this.allAvailableDrivers.filter(user => user.batch.batchLocation === userLocation).concat(this.allAvailableDrivers.filter(user => user.batch.batchLocation !== userLocation));
    this.availableDrivers = this.allAvailableDrivers;
  }

  /**
   * A function that orders the year of the car
   */

  orderByYear() {
    if (!this.orderYear) {
      this.availableDrivers.sort((a, b) => b.car.year - a.car.year);
    } else {
      this.availableDrivers.sort((a, b) => a.car.year - b.car.year);
    }
    this.orderYear = !this.orderYear;
  }

  /**
   * A function that orders the data by full name
   */

  orderByFullName() {
    if (!this.orderFirstName) {
      this.availableDrivers.sort((a, b) => a.firstName > b.firstName ? 1 : -1);
    } else {
      this.availableDrivers.sort((a, b) => a.firstName > b.firstName ? -1 : 1);
    }
    this.orderFirstName = !this.orderFirstName;
  }

  /**
   * A function that searches driver by name
   */

  searchDriverByName() {
    this.noUserFound = false;
    this.availableDrivers = this.allAvailableDrivers.filter(driver => `${driver.firstName} ${driver.lastName}`.toLowerCase().includes(this.searchName.toLowerCase()));
    if (this.availableDrivers.length === 0) {
      this.availableDrivers = this.allAvailableDrivers;
      this.noUserFound = true;
    }
  }

  /**
   * A function that searchs driver by location
   */

  searchDriverByLocation() {
    this.availableDrivers = this.allAvailableDrivers.filter(driver =>
     driver.batch.batchLocation.toLowerCase().includes(this.searchLocation.toLowerCase()))
    }
  /**
   * A function that filters by location
   *
   */

  filterDriverByLocation(event) {
    this.noUserFound = false;
    this.availableDrivers = this.allAvailableDrivers.filter(driver => driver.batch.batchLocation == event.target.value);
    if (this.availableDrivers.length === 0) {
      this.availableDrivers = this.allAvailableDrivers;
      this.noUserFound = true;
    }
  }

  /**
   * A GET method that retrieves all drivers
   */
  showAllDrivers() {
    this.searchName = '';
    this.orderByLocation();
  }

  /**
   * A function that hides the no user found message
   */
  hideMessage() {
    this.noUserFound = false;
  }
}
