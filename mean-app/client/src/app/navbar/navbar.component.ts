import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';
import { SnackbaralertService } from '../snackbaralert.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  username: string;
  loggedInText: string;
  routerLinkText: string;
  constructor(public auth: AuthenticationService, private router: Router,
  private alerts: SnackbaralertService) {
    //listens for the auth service to tell it to update the navbar
    this.auth.invokeEvent.subscribe(value => {
      if (value === "UpdateLink") {
        this.updateLink();
      }
    });
  }

  //updates the navbar depending on whether the user is logged in or out
  public updateLink() {
    this.username = this.auth.getUsername();
    var isLoggedIn = this.auth.isLoggedIn();
    if (isLoggedIn && this.username !== null) {
      this.loggedInText = "Hi, "+this.username;
      this.routerLinkText = "account";
    }
    else {
      this.loggedInText = "Sign In";
      this.routerLinkText = "signin";
    }
  }

  public signout() {
    this.auth.signout();
    //window.alert("You have been signed out.");
    this.alerts.open('You have been signed out.');
    this.updateLink();
    this.router.navigateByUrl('/');
  }

  ngOnInit() {
    this.updateLink();
  }

}
