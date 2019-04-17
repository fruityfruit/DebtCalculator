import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { SnackbaralertService } from '../snackbaralert.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {

  constructor(private auth: AuthenticationService, private alerts: SnackbaralertService) { }

  ngOnInit() {
    this.auth.callUpdateColor("info");
    if (window.localStorage.getItem("persistent-snackbar")) {
      window.localStorage.removeItem("persistent-snackbar");
      this.alerts.clearSnack();
    }
  }

}
