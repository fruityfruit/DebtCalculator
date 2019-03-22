import { Component, OnInit } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../authentication.service';
import { Router } from '@angular/router';
import { SnackbaralertService } from '../snackbaralert.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  credentials: TokenPayload = {
    username: '',
    password: ''
  }

  constructor(private auth: AuthenticationService, private router: Router,
  private alerts: SnackbaralertService) { }

  register() {
    if (this.credentials.username === '' || this.credentials.username.search(/dlcptwfcmc/i) > -1) { //the username uses our dummy sequence for temporary usernames
      //window.alert("Sorry, that username has already been taken. Please try another!");
      this.alerts.open('Sorry, that username has already been taken. Please try another!');
    } else {
      this.auth.register(this.credentials).subscribe(() => {
        this.auth.callUpdateLink();
        //window.alert("Registered!");
        this.alerts.open('Registered!');
        this.router.navigateByUrl('/');
      }, (err) => {
        if (err.error.code === 11000) { //Mongo error code that means duplicate key constraint violation
          //window.alert("Sorry, that username has already been taken. Please try another!");
          this.alerts.open('Sorry, that username has already been taken. Please try another!');
        } else {
          console.log(err);
          this.router.navigateByUrl('/');
        }
      });
    }
  }

  ngOnInit() { }

}
