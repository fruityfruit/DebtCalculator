import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthenticationService, TokenPayload } from '../authentication.service';
import { Router } from '@angular/router';
import { SnackbaralertService } from '../snackbaralert.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  profileForm: FormGroup;
  credentials: TokenPayload = {
    username: '',
    password: ''
  }

  constructor(private auth: AuthenticationService, private router: Router,
  private alerts: SnackbaralertService, private builder: FormBuilder) {
    this.profileForm = this.builder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  public signin() {
    this.credentials.username = this.profileForm.value.username;
    this.credentials.password = this.profileForm.value.password;
    this.auth.signin(this.credentials).subscribe(() => {
      this.alerts.open('Signed In!');
      this.router.navigateByUrl('/');
    }, (err) => {
      if (err.error && err.error.message && err.error.message === "Username or password incorrect") {
        this.alerts.open(err.error.message);
      } else {
        console.log(err);
        this.router.navigateByUrl('/');
      }
    });
  }

  ngOnInit() {
    this.auth.callUpdateColor("other");
  }

}
