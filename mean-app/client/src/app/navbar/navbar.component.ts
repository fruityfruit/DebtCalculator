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
    this.auth.invokeEvent.subscribe(value => {
      if(value === "UpdateLink") {
        this.updateLink();
      }
      else {
        console.log("heard an event but didn't call updateLink in navbar");
        console.log(value);
      }
    })
  }

  public updateLink() {
    this.username = this.auth.getUsername();
    if (this.username !== null) {
      this.loggedInText = "Account";
      this.routerLinkText = "account";
    }
    else {
      this.loggedInText = "Sign In";
      this.routerLinkText = "signin";
    }
  }

  ngOnInit() {
    this.updateLink();
  }

}
