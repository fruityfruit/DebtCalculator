import { Component, OnInit } from '@angular/core';
import { AuthenticationService, UsernamePayload, PasswordPayload, TokenPayload } from '../authentication.service';
import { Router } from '@angular/router';
import { SnackbaralertService } from '../snackbaralert.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  updateUsername: UsernamePayload = {
    oldUsername: '',
    newUsername: '',
    password: ''
  }
  updatePassword: PasswordPayload = {
    username: '',
    oldPassword: '',
    newPassword: ''
  }
  deleteAccount: TokenPayload = {
    username: '',
    password: ''
  }
  duplicateNewPassword: ''


  constructor(private auth: AuthenticationService, private router: Router,
  private alerts: SnackbaralertService) { }

  //calls the changeUsername function in the auth service
  username() {
    this.updateUsername.oldUsername = this.auth.getUsername();
    this.auth.changeUsername(this.updateUsername).subscribe(() => {
      this.updateUsername.oldUsername = '';
      this.updateUsername.newUsername = '';
      this.updateUsername.password = '';
      //window.alert("Username successfully updated");
      this.alerts.open('Username successfully updated');
      this.auth.callUpdateLink();
    }, (err) => {
      if (err.error && err.error.code && err.error.code === 11000) { //Mongo error code that means duplicate key constraint violation
        //window.alert("Sorry, that username has already been taken. Please try another!");
        this.alerts.open('Sorry, that username has already been taken. Please try another!');
      } else if (err.error && err.error.message) { //alerts the error
        //window.alert(err.error.message);
        this.alerts.open(err.error.message);
      } else {
        this.router.navigateByUrl('/');
      }
    });
  }

  //calls the changePassword function in the auth service
  password() {
    this.updatePassword.username = this.auth.getUsername();
    if (this.duplicateNewPassword === this.updatePassword.newPassword) { //if the two supposedly identical passwords match
      this.auth.changePassword(this.updatePassword).subscribe(() => {
        this.updatePassword.oldPassword = '';
        this.updatePassword.newPassword = '';
        this.duplicateNewPassword = '';
        //window.alert("Password successfully updated");
        this.alerts.open('Password successfully updated!');
      }, (err) => {
        if (err.error && err.error.message) { //alerts the error
          //window.alert(err.error.message);
          this.alerts.open(err.error.message);
        } else {
          this.router.navigateByUrl('/');
        }
      });
    } else {
      //window.alert("New passwords do not match");
      this.alerts.open('New passwords do not match.');
    }
  }

  //calls the signout function in the auth service
  signout() {
    this.auth.signout();
    //window.alert("You have been signed out.");
    this.alerts.open('You have been signed out.');
    this.auth.callUpdateLink();
    this.router.navigateByUrl('/');
  }

  //calls the deleteProfile function in the auth service
  delete() {
    this.deleteAccount.username = this.auth.getUsername();
    this.auth.deleteProfile(this.deleteAccount).subscribe(() => {
      //window.alert("This account has been deleted.");
      this.alerts.open('This account has been deleted.');
      this.auth.signout();
      this.auth.callUpdateLink();
      this.router.navigateByUrl('/');
    }, (err) => {
      if (err.error && err.error.message) {
        //window.alert(err.error.message); //alerts the error
        this.alerts.open(err.error.message);
      } else {
        this.router.navigateByUrl('/');
      }
    });
  }

  ngOnInit() {
    if (!this.auth.isLoggedIn()) {
      //window.alert("Please sign in before accessing this page.");
      this.alerts.open('Please sign in before accessing this page.')
      this.router.navigateByUrl('/signin');
    }
  }

}
