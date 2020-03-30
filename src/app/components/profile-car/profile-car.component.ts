import { Component, OnInit } from '@angular/core';
import { CarService } from 'src/app/services/car-service/car.service';
import { Car } from 'src/app/models/car';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user-service/user.service';

@Component({
  selector: 'app-profile-car',
  templateUrl: './profile-car.component.html',
  styleUrls: ['./profile-car.component.css']
})
export class ProfileCarComponent implements OnInit {

  make: string = "Car Make";
  model:string = "Car Model";
  color: string = "Car Color";
  year: number = 0;
  nrSeats:number = 0;
  currentCar: Car;
  success :string;
  currentUser: User;

  constructor(private carService: CarService, private userService: UserService) { }

  ngOnInit() {

    this.carService.getCarByUserId2(sessionStorage.getItem("userid")).subscribe((response)=>{
      this.currentCar = response;
      this.make = response.make;
      this.model = response.model;
      this.color = response.color;
      this.year = response.year;
      this.nrSeats = response.seats;
      console.log(this.currentCar);
    });


    this.userService.getUserById2(sessionStorage.getItem("userid")).subscribe((response)=>{
      this.currentUser = response;
      console.log(this.currentUser);
    });


  }

  createCarInfo(){
    this.currentCar.make = this.make;
    this.currentCar.model= this.model;
    this.currentCar.color = this.color;
    this.currentCar.year = this.year;
    this.currentCar.seats = this.nrSeats;
    console.log(this.currentCar);
    console.log(this.currentUser);
    this.carService.createCar(this.currentUser, this.currentCar);
    this.success = "Updated Successfully!";
  }

  updatesCarInfo(){
    this.currentCar.make = this.make;
    this.currentCar.model= this.model;
    this.currentCar.color = this.color;
    this.currentCar.year = this.year;
    this.currentCar.seats = this.nrSeats;
    //console.log(this.currentUser);
    this.carService.updateCarInfo(this.currentCar);
    this.success = "Updated Successfully!";
  }

  onSubmit() {
    if(this.currentCar) {
      return this.updatesCarInfo();
      console.log(this.currentCar);
    } else {
      return this.createCarInfo();
      console.log(this.currentUser)
    }
  }
}
