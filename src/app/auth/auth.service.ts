import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { BehaviorSubject, Observable, pipe, of } from "rxjs";
import { map, tap, take, switchMap } from "rxjs/operators";
import { AuthRespData } from './auth-resp-data.model';
import { User } from './user.model';
import { SnackbarService } from '../shared/snackbar.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: "root",
})
export class AuthService {
  public currentUser: Observable<firebase.User>;

  constructor(
    private afAuth: AngularFireAuth,
    private fb: AngularFirestore,
    private snackbarService: SnackbarService
  ) {
    this.currentUser = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.fb.doc<any>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  async signup(displayName: string, email: string, password: string) {
    try {
      const user = await this.afAuth.auth.createUserWithEmailAndPassword(
        email,
        password
      );
      console.log("User created: ", user);
      const newUser = {
        displayName: displayName.split(' ')[0].substring(0, 1).toUpperCase() + displayName.split(' ')[1].substring(0, 1).toUpperCase(),
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      };
      this.fb.collection('users').doc(user.user.uid).set(newUser);
    } catch (error) {
      this.snackbarService.openSnackBar(error.message, "Close", 5000);
    }
  }

  async login(email: string, password: string) {
    try {
      const user = await this.afAuth.auth.signInWithEmailAndPassword(
        email,
        password
      );
      console.log("User logged in: ", user);
    } catch (error) {
      this.snackbarService.openSnackBar(error.message, "Close", 5000);
    }
  }

  getUserProfile() {
    if (this.currentUser) {

    }
  }

  logout() {
    this.afAuth.auth.signOut();
  }
}
