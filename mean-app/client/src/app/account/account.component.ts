import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  constructor(private auth: AuthenticationService, private router: Router) { }

  public signout() {
    this.auth.signout();
    window.alert("You have been signed out.");
    this.auth.callUpdateLink();
    this.router.navigateByUrl('/');
  }

  ngOnInit() {
  }

}
