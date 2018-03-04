import { Component, OnInit } from '@angular/core';

import { User } from '../models/User';
import { GetConnectionsService } from '../services/getConnections.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-connections',
  templateUrl: './connections.component.html',
  styleUrls: ['./connections.component.css']
})
export class ConnectionsComponent implements OnInit {

  private connections: Array<User> = [];
  private users: Array<User> = [];

  constructor(private flashMessagesService: FlashMessagesService,
              private getConnectionsService: GetConnectionsService,
              private userService: UserService) { }

  ngOnInit() {
    this.getConnectionsForUser();
    this.getAllUsers();
  }

  getConnectionsForUser() {
    let user_id = localStorage.getItem("user_id");
    this.getConnectionsService.getConnectionsForUser(user_id)
      .subscribe((response) => {
        this.connections = response;
      }, (error) => {
        this.flashMessagesService.show(error.message, {
          cssClass: 'alert-danger',
          timeout: 3000
        })
      });
  }

  getAllUsers() {
    this.userService.getAllUsers()
      .subscribe((response) => {
        this.users = response;
      }, (error) => {
        this.flashMessagesService.show(error.message, {
          cssClass: 'alert-danger',
          timeout: 3000
        });
      })
  }

  searchEmail(event) {
    console.log("search email. value:", event.target.value);
  }

  searchUserName(event) {

  }

}
