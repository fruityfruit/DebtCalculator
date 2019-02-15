import { Component, OnInit } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../authentication.service';
import { Router } from '@angular/router';

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

  constructor(private auth: AuthenticationService, private router: Router) { }

  register() {
    this.auth.register(this.credentials).subscribe(() => {
      this.auth.callUpdateLink();
      this.router.navigateByUrl('/');
    }, (err) => {
      if(err.error.code === 11000) { //Mongo error code that means duplicate key constraint violation
        window.alert("Sorry, that username has already been taken. Please try another!");
      } else {
        this.router.navigateByUrl('/');
      }
    });
  }

  ngOnInit() { }

}
