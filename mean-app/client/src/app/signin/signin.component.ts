import { Component, OnInit } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../authentication.service';
import { Router } from '@angular/router';
import { SnackbaralertService } from '../snackbaralert.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  credentials: TokenPayload = {
    username: '',
    password: ''
  }

  constructor(private auth: AuthenticationService, private router: Router,
  private alerts: SnackbaralertService) { }

  public signin() {
    this.auth.signin(this.credentials).subscribe(() => {
      this.auth.callUpdateLink(); //updates the navbar
      //window.alert("Signed In!");
      this.alerts.open('Signed In!');
      this.router.navigateByUrl('/');
    }, (err) => {
      if (err.error && err.error.message && err.error.message === "Username or password incorrect") {
        //window.alert(err.error.message);
        this.alerts.open(err.error.message);
      } else {
        console.log(err);
        this.router.navigateByUrl('/');
      }
    });
  }

  ngOnInit() { }

}
