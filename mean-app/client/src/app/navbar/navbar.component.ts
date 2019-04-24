import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from "../authentication.service";
import { Router } from "@angular/router";
import { SnackbaralertService } from "../snackbaralert.service";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"]
})
export class NavbarComponent implements OnInit {

  constructor(public auth: AuthenticationService, private router: Router,
              private alerts: SnackbaralertService) {
    //listens for the auth service to tell it to update the navbar
    this.auth.invokeEvent.subscribe(value => {
      this.updateColor(value);
    });
  }

  //updates the colors of the navbar depending on what page the user is on
  public updateColor(value: string) {
    if (value === "profile") {
      document.getElementById("link1").style.color = "white";
      document.getElementById("link2").style.color = "rgba(255,255,255,0.6)";
      document.getElementById("link3").style.color = "rgba(255,255,255,0.6)";
      document.getElementById("link4").style.color = "rgba(255,255,255,0.6)";
      document.getElementById("link5").style.color = "rgba(255,255,255,0.6)";
      if (document.getElementById("link6")) document.getElementById("link6").style.color = "rgba(255,255,255,0.6)";
    } else if (value === "opportunities") {
      document.getElementById("link1").style.color = "rgba(255,255,255,0.6)";
      document.getElementById("link2").style.color = "white";
      document.getElementById("link3").style.color = "rgba(255,255,255,0.6)";
      document.getElementById("link4").style.color = "rgba(255,255,255,0.6)";
      document.getElementById("link5").style.color = "rgba(255,255,255,0.6)";
      if (document.getElementById("link6")) document.getElementById("link6").style.color = "rgba(255,255,255,0.6)";
    } else if (value === "debts") {
      document.getElementById("link1").style.color = "rgba(255,255,255,0.6)";
      document.getElementById("link2").style.color = "rgba(255,255,255,0.6)";
      document.getElementById("link3").style.color = "white";
      document.getElementById("link4").style.color = "rgba(255,255,255,0.6)";
      document.getElementById("link5").style.color = "rgba(255,255,255,0.6)";
      if (document.getElementById("link6")) document.getElementById("link6").style.color = "rgba(255,255,255,0.6)";
    } else if (value === "results") {
      document.getElementById("link1").style.color = "rgba(255,255,255,0.6)";
      document.getElementById("link2").style.color = "rgba(255,255,255,0.6)";
      document.getElementById("link3").style.color = "rgba(255,255,255,0.6)";
      document.getElementById("link4").style.color = "white";
      document.getElementById("link5").style.color = "rgba(255,255,255,0.6)";
      if (document.getElementById("link6")) document.getElementById("link6").style.color = "rgba(255,255,255,0.6)";
    } else if (value === "info") {
      document.getElementById("link1").style.color = "rgba(255,255,255,0.6)";
      document.getElementById("link2").style.color = "rgba(255,255,255,0.6)";
      document.getElementById("link3").style.color = "rgba(255,255,255,0.6)";
      document.getElementById("link4").style.color = "rgba(255,255,255,0.6)";
      document.getElementById("link5").style.color = "white";
      if (document.getElementById("link6")) document.getElementById("link6").style.color = "rgba(255,255,255,0.6)";
    } else if (value === "account") {
      document.getElementById("link1").style.color = "rgba(255,255,255,0.6)";
      document.getElementById("link2").style.color = "rgba(255,255,255,0.6)";
      document.getElementById("link3").style.color = "rgba(255,255,255,0.6)";
      document.getElementById("link4").style.color = "rgba(255,255,255,0.6)";
      document.getElementById("link5").style.color = "rgba(255,255,255,0.6)";
      if (document.getElementById("link6")) document.getElementById("link6").style.color = "white";
    } else {
      document.getElementById("link1").style.color = "rgba(255,255,255,0.6)";
      document.getElementById("link2").style.color = "rgba(255,255,255,0.6)";
      document.getElementById("link3").style.color = "rgba(255,255,255,0.6)";
      document.getElementById("link4").style.color = "rgba(255,255,255,0.6)";
      document.getElementById("link5").style.color = "rgba(255,255,255,0.6)";
      if (document.getElementById("link6")) document.getElementById("link6").style.color = "rgba(255,255,255,0.6)";
    }
  }

  public signout() {
    this.closeDropdown();
    this.auth.signout();
    this.alerts.open("You have been signed out.");
    this.router.navigateByUrl("/");
  }

  public responsive() {
    var x = document.getElementById("navbar");
    if (x.className === "topnav") {
      x.className += " responsive";
    } else {
      x.className = "topnav";
    }
  }

  public closeDropdown() {
    document.getElementById("navbar").className = "topnav";
  }

  ngOnInit() { }
}
