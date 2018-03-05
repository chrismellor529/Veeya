import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { User } from '../models/User';
import { AppRoutingModule } from '../app-routing.module';
import { Router } from '@angular/router';
import { InviteService } from '../services/invite.service';
import { ModuleWithProviders } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-invite-lender',
  templateUrl: './invite-lender.component.html',
  styleUrls: ['./invite-lender.component.css']
})
export class InviteLenderComponent implements OnInit {

  private lender: User;

  constructor(private inviteService: InviteService,
              private router: Router,
              private flashMessage: FlashMessagesService) { }

  ngOnInit() {
    let user_id = localStorage.getItem('user_id');
    this.lender = {
      userType: 'Lender',
      userName: '',
      password: 'initialPassword',
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      user_id: user_id
    }
  }

  public onSubmit() {
    this.lender.userName = this.lender.firstName.toString() + this.lender.lastName.toString();
    this.inviteService.inviteLender(this.lender)
      .subscribe((response) => {
        this.router.navigate(['/dashboard']);
        this.flashMessage.show(response.message, {
          cssClass: 'alert-success',
          timeout: 3000
        });
      },
      (error) => {
        this.flashMessage.show(error.message, {
          cssClass: 'alert-danger',
          timeout: 3000
        });
      });
  }

}
