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

  ngOnInit() { }

  register() {
    console.log(this.credentials);
    this.auth.register(this.credentials).subscribe(() => {
      this.router.navigateByUrl('/opportunity');
    }, (err) => {
      console.error(err);
      this.router.navigateByUrl('/profile');
    });
  }

  // dlandrum() {
  //   console.log(this.credentials);
  //   this.auth.dlandrum().subscribe(() => {
  //     this.router.navigateByUrl('/');
  //   }, (err) => {
  //     console.error(err);
  //     //this.router.navigateByUrl('/opportunity');
  //   });
  // }

}
