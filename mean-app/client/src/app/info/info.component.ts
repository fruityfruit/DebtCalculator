import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from "../authentication.service";
import { SnackbarService } from "../snackbar.service";

@Component({
  selector: "app-info",
  templateUrl: "./info.component.html",
  styleUrls: ["./info.component.css"]
})
export class InfoComponent implements OnInit {

  constructor(private auth: AuthenticationService, private alerts: SnackbarService) { }

  /*
    On Init, this page first recolors the navbar to un-highlight any other pages that may have been previously highlit and highlight this page.
    It then removes the "persistent-snackbar" boolean from the user's cookies and clears the alert, if applicable.
    On this page, we do not want any old alerts to display, so if one (aka, the aforementioned "persistent-snackbar") is displayed,
    we remove it.
  */
  ngOnInit() {
    this.auth.callUpdateColor("info");
    if (window.localStorage.getItem("persistent-snackbar")) {
      window.localStorage.removeItem("persistent-snackbar");
      this.alerts.clearSnack();
    }
  }

}
