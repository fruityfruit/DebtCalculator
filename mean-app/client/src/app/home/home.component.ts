import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from "../authentication.service";
import { SnackbaralertService } from "../snackbaralert.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {

  constructor(public auth: AuthenticationService, private alerts: SnackbaralertService) { }

  ngOnInit() {
    this.auth.callUpdateColor("other");
    if (window.localStorage.getItem("persistent-snackbar")) {
      window.localStorage.removeItem("persistent-snackbar");
      this.alerts.clearSnack();
    }
  }

}
