import { Component, OnInit } from '@angular/core';

import { User } from '../models/User';
import { AuthService } from '../services/auth.service';
import { PhotosService } from '../services/photos.service';
import { UserService } from '../services/user.service';
import { ValidateService } from '../services/validate.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {

  private currentUser: User;
  private edit: Boolean = false;
  private photo: File;

  constructor(private authService: AuthService,
              private photosService: PhotosService,
              private userService: UserService,
              private validateService: ValidateService) { }

  ngOnInit() {
    document.getElementById("updateFormButton").setAttribute('disabled', 'disabled');
    document.getElementById("updatePhotoButton").setAttribute('disabled', 'disabled');
    this.getCurrentUser();
    this.currentUser = {
      userType: '',
      userName: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phoneNumber: '',
      city: '',
      state: '',
      profilePhoto: '',
      connections: [],
      URLs: {
        personal: '',
        facebook: '',
        linkedIn: '',
        biggerPockets: ''
      }
    }
  }

  onSubmit() {
    this.userService.updateUserProfile(this.currentUser)
      .subscribe((response) => {
        this.currentUser = response;
        document.getElementById("updateFormButton").setAttribute('disabled', 'disabled');
      }, (error) => {

      });
  }

  getCurrentUser() {
    this.authService.getLoggedInUser()
      .subscribe((response) => {
        this.currentUser = response.data;
      }, (error) => {

      })
  }

  isDisabled() {
    return !this.edit;
  }

  editProfile() {
    document.getElementById("updateFormButton").removeAttribute('disabled');
    this.edit = !this.edit;
  }

  addProfileImage(event) {
    let file = event.target.files[0];
    let fileType = file["type"];
    if (this.validateService.validatePhotoInput(fileType)) {
      this.photo = file;
      document.getElementById("updatePhotoButton").removeAttribute('disabled');
    } else {
      // display an error message telling user to upload a file that is an image
    }
  }

  uploadProfilePhoto() {
    this.photosService.uploadProfileImagePhoto(this.photo, (error, photo) => {
      if (error) {
        // error message = 'Error uploading photos. Please try again later.'
      } else {
        let inputValue = (<HTMLInputElement>document.getElementById('imageInput'));
        inputValue.value = "";
        this.photosService.getProfileImageUrl(photo, (error, firebasePhoto) => {
          if (error) {
            // error message = 'Error submitting form. Please try again.'
            return;
          } else {
            this.userService.updateUserProfilePhoto(firebasePhoto)
              .subscribe((response) => {
                this.currentUser.profilePhoto = firebasePhoto;
                // this.currentUser.profilePhoto is the valid URL
                // get response, console log it and set this.currentUser.profilePhoto to
              }, (error) => {

              })
          }
        });
      }
    });
  }

}
