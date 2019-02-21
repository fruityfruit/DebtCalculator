import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  username: string;
  loggedInText: string;
  routerLinkText: string;
  constructor(private auth: AuthenticationService, private router: Router) {
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

  ngOnInit() {
    this.updateLink();
    // window.addEventListener("unload", function(event) {
    //   console.log("unload event listener heard");
    //   this.auth.signout();
    // }.bind(this));
  }

}
