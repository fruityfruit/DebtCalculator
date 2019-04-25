import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from "../authentication.service";
import { Router } from "@angular/router";
import { SnackbarService } from "../snackbar.service";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"]
})
export class NavbarComponent implements OnInit {

  constructor(public auth: AuthenticationService, private router: Router,
              private alerts: SnackbarService) {
    this.auth.invokeEvent.subscribe(value => { //listens for the auth service to tell it to update the navbar
      this.updateColor(value);
    });
  }

  /*
    This function updates the colors of the navbar depending on what page the user is on.
    It is called by the auth service.
  */
  public updateColor(value: string) {
    if (value === "profile") {
      document.getElementById("profile").style.color = "white";
      document.getElementById("opportunities").style.color = "rgba(255,255,255,0.6)";
      document.getElementById("debts").style.color = "rgba(255,255,255,0.6)";
      document.getElementById("results").style.color = "rgba(255,255,255,0.6)";
      document.getElementById("info").style.color = "rgba(255,255,255,0.6)";
      if (document.getElementById("account")) document.getElementById("account").style.color = "rgba(255,255,255,0.6)";
    } else if (value === "opportunities") {
      document.getElementById("profile").style.color = "rgba(255,255,255,0.6)";
      document.getElementById("opportunities").style.color = "white";
      document.getElementById("debts").style.color = "rgba(255,255,255,0.6)";
      document.getElementById("results").style.color = "rgba(255,255,255,0.6)";
      document.getElementById("info").style.color = "rgba(255,255,255,0.6)";
      if (document.getElementById("account")) document.getElementById("account").style.color = "rgba(255,255,255,0.6)";
    } else if (value === "debts") {
      document.getElementById("profile").style.color = "rgba(255,255,255,0.6)";
      document.getElementById("opportunities").style.color = "rgba(255,255,255,0.6)";
      document.getElementById("debts").style.color = "white";
      document.getElementById("results").style.color = "rgba(255,255,255,0.6)";
      document.getElementById("info").style.color = "rgba(255,255,255,0.6)";
      if (document.getElementById("account")) document.getElementById("account").style.color = "rgba(255,255,255,0.6)";
    } else if (value === "results") {
      document.getElementById("profile").style.color = "rgba(255,255,255,0.6)";
      document.getElementById("opportunities").style.color = "rgba(255,255,255,0.6)";
      document.getElementById("debts").style.color = "rgba(255,255,255,0.6)";
      document.getElementById("results").style.color = "white";
      document.getElementById("info").style.color = "rgba(255,255,255,0.6)";
      if (document.getElementById("account")) document.getElementById("account").style.color = "rgba(255,255,255,0.6)";
    } else if (value === "info") {
      document.getElementById("profile").style.color = "rgba(255,255,255,0.6)";
      document.getElementById("opportunities").style.color = "rgba(255,255,255,0.6)";
      document.getElementById("debts").style.color = "rgba(255,255,255,0.6)";
      document.getElementById("results").style.color = "rgba(255,255,255,0.6)";
      document.getElementById("info").style.color = "white";
      if (document.getElementById("account")) document.getElementById("account").style.color = "rgba(255,255,255,0.6)";
    } else if (value === "account") {
      document.getElementById("profile").style.color = "rgba(255,255,255,0.6)";
      document.getElementById("opportunities").style.color = "rgba(255,255,255,0.6)";
      document.getElementById("debts").style.color = "rgba(255,255,255,0.6)";
      document.getElementById("results").style.color = "rgba(255,255,255,0.6)";
      document.getElementById("info").style.color = "rgba(255,255,255,0.6)";
      if (document.getElementById("account")) document.getElementById("account").style.color = "white";
    } else {
      document.getElementById("profile").style.color = "rgba(255,255,255,0.6)";
      document.getElementById("opportunities").style.color = "rgba(255,255,255,0.6)";
      document.getElementById("debts").style.color = "rgba(255,255,255,0.6)";
      document.getElementById("results").style.color = "rgba(255,255,255,0.6)";
      document.getElementById("info").style.color = "rgba(255,255,255,0.6)";
      if (document.getElementById("account")) document.getElementById("account").style.color = "rgba(255,255,255,0.6)";
    }
  }

  /*
    This function closes the dropdown (if applicable), calls the signout function in the auth service,
    alerts the user that they have been signed out, and redirects the user to the landing page.
  */
  public signout() {
    this.closeDropdown();
    this.auth.signout();
    this.alerts.open("You have been signed out.");
    this.router.navigateByUrl("/");
  }

  /*
    This function opens or closes the dropdown, depending on its current state.
  */
  public toggleDropdown() {
    var navbar = document.getElementById("navbar");
    if (navbar.className === "topnav") { //currently closed
      navbar.className += " dropdown"; //open the dropdown
    } else { //currently open
      navbar.className = "topnav"; //close the dropdown
    }
  }
  /*
    This function closes the dropdown regardless of current state.
  */
  public closeDropdown() {
    document.getElementById("navbar").className = "topnav";
  }

  ngOnInit() { }
}
