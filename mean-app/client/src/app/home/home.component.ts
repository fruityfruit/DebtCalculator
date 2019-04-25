import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from "../authentication.service";
import { SnackbarService } from "../snackbar.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {

  constructor(public auth: AuthenticationService, private alerts: SnackbarService) { }
  
  /*
    On Init, this page first recolors the navbar to un-highlight any other pages that may have been previously highlit.
    It then removes the "persistent-snackbar" boolean from the user's cookies and clears the alert, if applicable.
    On this page, we do not want any old alerts to display, so if one (aka, the aforementioned "persistent-snackbar") is displayed,
    we remove it.
  */
  ngOnInit() {
    this.auth.callUpdateColor("other");
    if (window.localStorage.getItem("persistent-snackbar")) {
      window.localStorage.removeItem("persistent-snackbar");
      this.alerts.clearSnack();
    }
  }

}
