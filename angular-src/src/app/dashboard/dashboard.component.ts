import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../services/profile.service';
import { Property } from '../models/Property';

import { AppRoutingModule } from '../app-routing.module';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  private user: any;
  private properties: Property[] = [];
  private userID: String;
  private userType: String;

  constructor(private profileService: ProfileService,
              private flashMessageService: FlashMessagesService) { }

  ngOnInit() {
    this.user = {
      firstName: '',
      lastName: '',
      userName: '',
      email: '',
      phoneNumber: '',
      properties: this.properties
    }
    this.userID = localStorage.getItem('user_id');
    this.userType = localStorage.getItem('user_type');
    if (this.userType === 'Wholesaler') {
      this.getWholesalerProfileInfo();
    } else if (this.userType === 'Investor') {
      this.getInvestorProfileInfo();
    } else {
      console.log("this.userType is not available.");
    }
  }

  getWholesalerProfileInfo() {
    this.profileService.getWholesalerProfileInfo(this.userID)
      .subscribe((response) => {
        this.user = response;
        this.properties = response.properties;
      }, (error) => {
        this.flashMessageService.show(error.message, {
          cssClass: 'alert-danger',
          timeout: 3000
        })
      });
  }

  getInvestorProfileInfo() {
    this.profileService.getInvestorProfileInfo(this.userID)
      .subscribe((response) => {
        this.user = response;
        this.properties = response.properties;
      }, (error) => {
        this.flashMessageService.show(error.message, {
          cssClass: 'alert-danger',
          timeout: 3000
        })
      })
  }

}
