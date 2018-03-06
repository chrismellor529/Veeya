import { Component, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

import { AppRoutingModule } from '../app-routing.module';
import { ModuleWithProviders } from '@angular/core';

import { Property } from '../models/Property';

import { AuthService } from '../services/auth.service';
import { AddPropertyService } from '../services/addProperty.service';
import { PhotosService } from '../services/photos.service';
import { ValidateService } from '../services/validate.service';


@Component({
  selector: 'app-add-property',
  templateUrl: './add-property.component.html',
  styleUrls: ['./add-property.component.css']
})
export class AddPropertyComponent implements OnInit {

  private newProperty: Property;
  private photo: File;
  private photos: Array<File> = [];
  private uploadedPhotos: Array<String> = [];

  constructor(private authService: AuthService,
              private addPropertyService: AddPropertyService,
              private photosService: PhotosService,
              private router: Router,
              private validateService: ValidateService) { }

  ngOnInit() {
    document.getElementById('removePhotos').hidden = true;
    document.getElementById('uploadPhotos').hidden = true;
    let wholesalerID = this.authService.loggedInUser();
    this.newProperty = {
      _id: 0,
      wholesaler_id: wholesalerID,
      address: 'Form Address1',
      city: 'Las Vegas',
      state: 'NV',
      zipCode: 89109,
      purchasePrice: 250000,
      bedrooms: 3,
      bathrooms: 3,
      rehabCostMin: 10000,
      rehabCostMax: 20000,
      afterRepairValue: 350000,
      averageRent: 1200,
      squareFootage: 1278,
      propertyType: 'Single Family',
      yearBuilt: 1987,
      status: 'contractYes',
      comps: 450000,
      photos: []
    }
  }

  public onSubmit() {
    this.photosService.getPropertyPhotoUrls(this.uploadedPhotos, (error, photos) => {
      if (error) {
        // error message = 'Error submitting form. Please try again.'
        return;
      } else {
        this.newProperty.photos = photos;
      }
    });

    this.addPropertyService.addProperty(this.newProperty)
      .subscribe((response) => {
        if (response.success === true) {
          this.router.navigate(['/dashboard']);
        }
      }, (error) => {

      });
  }

  public addPhoto(event) {
    let file = event.target.files[0];
    let fileType = file["type"];
    if (this.validateService.validatePhotoInput(fileType)) {
      this.photo = event.target.files[0];
      this.photos.push(this.photo);
      document.getElementById('selectedFiles').innerHTML += file.name + "</br>";
      document.getElementById('removePhotos').hidden = false;
      document.getElementById('uploadPhotos').hidden = false;
    } else {
      // display an error message telling user to upload a file that is an image
    }
    if (this.photos.length === 3) {
      let inputButton = (<HTMLInputElement>document.getElementById('imageInput'));
      inputButton.disabled = true;
    }
  }

  public uploadPhotos(event) {
    this.photosService.uploadPropertyPhotos(this.photos, (error, photos) => {
      if (error) {
        // error message = 'Error uploading photos. Please try again later.'
      } else {
        this.uploadedPhotos = photos;
      }
    });
  }

  public removePhotos() {
    this.photos = [];
    document.getElementById('selectedFiles').innerHTML = "";
    let inputValue = (<HTMLInputElement>document.getElementById('imageInput'));
    inputValue.value = "";
    inputValue.disabled = false;
  }

}
