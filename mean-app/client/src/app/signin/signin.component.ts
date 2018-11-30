import { Component, OnInit } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../authentication.service';
import { Router } from '@angular/router';

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

  constructor(private auth: AuthenticationService, private router: Router) { }

  ngOnInit() { }

  signin() {
    this.auth.signin(this.credentials).subscribe(() => {
      this.router.navigateByUrl('/');
    }, (err) => {
      if(err.error.message === "Username or password incorrect") {
        console.log("trying to pop up window"); //TODO
      } else {
        this.router.navigateByUrl('/');
      }
    });
  }

}
