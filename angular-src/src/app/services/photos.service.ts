import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AngularFireStorage } from 'angularfire2/storage';
import * as firebase from 'firebase';

import { AuthService } from './auth.service';

import 'rxjs/add/operator/map';

@Injectable()
export class PhotosService {

  private error: Boolean = false;
  private formData: FormData = new FormData();
  private photos: Array<File> = [];
  private photoURLs: Array<String> = [];
  private propertyPhotosFolder: any;
  private user_id: String;

  constructor(private authService: AuthService,
              private storage: AngularFireStorage)
  {
    this.propertyPhotosFolder = 'property-photos';
    this.user_id = this.authService.loggedInUser();
  }

  public uploadPropertyPhotos(photos: Array<File>, callback) {
    let storageRef = firebase.storage().ref();
    for (let i = 0; i < photos.length; i++) {
      let path = `${this.propertyPhotosFolder}/${this.user_id}/` + photos[i].name;
      let imageRef = storageRef.child(path);
      imageRef.put(photos[i])
        .then((snapshot) => {
          if (snapshot.state !== 'success') {
            this.error = true;
          } else {
            this.photoURLs.push(path);
            if (i == (photos.length - 1)) {
              if (!this.error) {
                callback(false, this.photoURLs);
              } else {
                callback(true);
              }
            }
          }
        });
    }
  }

  public removePropertyPhoto(photoName: String, callback) {
    let storageRef = firebase.storage().ref();
    let path = `${this.propertyPhotosFolder}/${this.user_id}/` + photoName;
    storageRef.delete()
      .then(() => {
        callback(false);
      })
      .catch((error) => {
        callback(true);
      });
  }

  public getPropertyPhotoUrls(photos: Array<string>, callback) {
    let urls = [];
    let storageRef = firebase.storage();
    let path = `${this.propertyPhotosFolder}/${this.user_id}/`;
    for (let i = 0; i < photos.length; i++) {
      let pathRef = storageRef.ref(photos[i]);
      console.log("pathref:", pathRef)
      pathRef.getDownloadURL()
        .then((url) => {
          console.log("received url from downloadURL()", url)
          urls.push(url);
        })
        .catch((error) => {
          callback(true);
          return;
        })
        .then(() => {
          if (i == (photos.length - 1)) {
            console.log("urls before callback:", urls);
            callback(false, urls);
          }
        })
    }
  }
}
