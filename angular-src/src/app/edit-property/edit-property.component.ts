import { Component, OnInit } from '@angular/core';
import { Property } from '../models/Property';
import { AppRoutingModule } from '../app-routing.module';
import { ActivatedRoute, Router } from '@angular/router';

import { User } from '../models/User';

import { AuthService } from '../services/auth.service';
import { DeletePropertyService } from '../services/deleteProperty.service';
import { EditPropertyService } from '../services/editProperty.service';
import { PhotosService } from '../services/photos.service';
import { ValidateService } from '../services/validate.service';

@Component({
  selector: 'app-edit-property',
  templateUrl: './edit-property.component.html',
  styleUrls: ['./edit-property.component.css']
})
export class EditPropertyComponent implements OnInit {

  private currentUser: User;
  private photo: File;
  private testPhotos: Array<String> = [];
  private photos: Array<string> = [];
  private photosToAdd: Array<File> = [];
  private propertyID: string;
  private initialProperty: Property;

  constructor(private authService: AuthService,
              private route: ActivatedRoute,
              private deletePropertyService: DeletePropertyService,
              private editPropertyService: EditPropertyService,
              private router: Router,
              private photosService: PhotosService,
              private validateService: ValidateService
              ) {
    this.getCurrentUser();
    this.propertyID = route.snapshot.params['id'];
    this.getProperty(this.propertyID);
  }

  ngOnInit() {
    document.getElementById('removePhotos').hidden = true;
    document.getElementById('uploadPhotos').hidden = true;
    let wholesalerID = this.authService.loggedInUser();

    this.initialProperty = {
      _id: 0,
      wholesaler_id: wholesalerID,
      address: '',
      city: '',
      state: 'AL',
      zipCode: '',
      purchasePrice: '',
      bedrooms: 0,
      bathrooms: 0,
      expectedRehab: '',
      afterRepairValue: '',
      HOA: '',
      propertyTaxes: '',
      utilities: '',
      capRate: '',
      averageRent: '',
      squareFootage: '',
      propertyType: 'Single Family',
      yearBuilt: '',
      sellerFinancing: 'false',
      status: 'contractYes',
      insurance: '',
      comps: [
        {
          firstCompAddress: '',
          firstCompPrice: ''
        },
        {
          secondCompAddress: '',
          secondCompPrice: ''
        },
        {
          thirdCompAddress: '',
          thirdCompPrice: ''
        }
      ],
      photos: []
    }

    this.currentUser = {
      userType: '',
      firstName: '',
      lastName: '',
      userName: '',
      password: '',
      email: '',
      phoneNumber: '',
      city: '',
      state: '',
      URLs: {
        personal: '',
        facebook: '',
        linkedIn: '',
        biggerPockets: ''
      }
    }

    this.testPhotos = ["https://scontent.flas1-1.fna.fbcdn.net/v/t1.0-9/26993322_3918229670408_8250173985738273633_n.jpg?oh=6794919c8e47c6ba7d54143eb3c357a7&oe=5B43F786", "https://scontent.flas1-1.fna.fbcdn.net/v/t1.0-9/26993322_3918229670408_8250173985738273633_n.jpg?oh=6794919c8e47c6ba7d54143eb3c357a7&oe=5B43F786", "https://scontent.flas1-1.fna.fbcdn.net/v/t1.0-9/26993322_3918229670408_8250173985738273633_n.jpg?oh=6794919c8e47c6ba7d54143eb3c357a7&oe=5B43F786"];
  }

  getCurrentUser() {
    this.authService.getLoggedInUser()
      .subscribe((response) => {
        this.currentUser = response.data;
      }, (error) => {

      })
  }

  getProperty(id) {
    this.editPropertyService.getPropertyByID(id)
      .subscribe((response) => {
        this.initialProperty = response.data;
        this.photos = this.initialProperty.photos;
        if (this.initialProperty.photos.length === 3) {
          let inputButton = (<HTMLInputElement>document.getElementById('imageInput'));
          inputButton.disabled = true;
          document.getElementById('uploadPhotos').hidden = true;
        }

        if (this.initialProperty.status === "Listed") {
          document.getElementById("listedButton").hidden = true;
        } else if (this.initialProperty.status === "Sold") {
          document.getElementById("soldButton").hidden = true;
        }
      }, (error) => {

      });
  }

  onSubmit() {
    this.photosService.getPropertyPhotoUrls(this.photos, (error, photos) => {
      if (error) {
        // error message
        return;
      } else {
        this.initialProperty.photos = photos;
      }
    });

    this.editPropertyService.editProperty(this.initialProperty)
      .subscribe((response) => {
        if (response.success) {
          this.router.navigate(['/dashboard']);
       }
      }, (error) => {

      });
  }

  addPhoto(event) {
    let file = event.target.files[0];
    let fileType = file["type"];
    if (this.validateService.validatePhotoInput(fileType)) {
      this.photo = event.target.files[0];
      this.photosToAdd.push(this.photo);
      document.getElementById('selectedFiles').innerHTML += file.name + "</br>";

      if (this.photos.length + this.photosToAdd.length === 3) {
        let inputButton = (<HTMLInputElement>document.getElementById('imageInput'));
        inputButton.disabled = true;
      }
    }

  }

  uploadPhotos(event) {
    document.getElementById('uploadPhotos').setAttribute('disabled', 'disabled');
    this.photosService.uploadPropertyPhotos(this.photosToAdd, (error, photos) => {
      if (error) {

      } else {
        let inputValue = (<HTMLInputElement>document.getElementById('imageInput'));
        inputValue.value = "";
        document.getElementById('removePhotos').hidden = true;
        document.getElementById('uploadPhotos').hidden = true;
        this.photos = photos;
        this.photosToAdd = [];
      }
    })
  }

  removePhoto(photo) {
    this.photosService.removePropertyPhoto(photo, (error) => {
      if (error) {
        // error message = 'Error removing photo. Please try again.'
      } else {
        // message = 'Successfully removed photo.'
      }
    });
  }

  sold() {
    let soldConfirm = confirm("Are you sure you want to mark this property as sold?");
    if (soldConfirm) {
      this.initialProperty.status = "Sold";
      this.editPropertyService.editProperty(this.initialProperty)
        .subscribe((response) => {
          if (response.success) {
            document.getElementById("soldButton").hidden = true;
            document.getElementById("listedButton").hidden = false;
          }
        }, (error) => {

        });
    }
  }

  listed() {
    let listedConfirm = confirm("Are you sure you want to mark this property as listed?");
    if (listedConfirm) {
      this.initialProperty.status = "Listed";
      this.editPropertyService.editProperty(this.initialProperty)
        .subscribe((response) => {
          if (response.success) {
            document.getElementById("soldButton").hidden = false;
            document.getElementById("listedButton").hidden = true;
          }
        }, (error) => {

        });
    }
  }

  deleteProperty() {
    let deleteConfirm = confirm("Are you sure you want to delete this property?");
    if (deleteConfirm) {
      this.deletePropertyService.removePhotos(this.initialProperty.photos);
      this.deletePropertyService.deleteProperty(this.initialProperty._id)
        .subscribe((response) => {
          if (response.success) {
            this.router.navigate(['/dashboard']);
          }
        },(error) => {

        })
    }
  }

}
