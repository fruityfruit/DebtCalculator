import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { AuthenticationService, TokenPayload } from "../authentication.service";
import { Router } from "@angular/router";
import { SnackbarService } from "../snackbar.service";

@Component({
  selector: "app-signin",
  templateUrl: "./signin.component.html",
  styleUrls: ["./signin.component.css"]
})
export class SigninComponent implements OnInit {
  loginForm: FormGroup;
  credentials: TokenPayload = {
    username: "",
    password: ""
  }

  constructor(private auth: AuthenticationService, private router: Router,
              private alerts: SnackbarService, private builder: FormBuilder) {
    this.loginForm = this.builder.group({
      username: ["", Validators.required],
      password: ["", Validators.required]
    });
  }

  /*
    This function signs a user into their account. It calls the signin function in the auth service to do this.
    If the call is successful, it alerts the user and navigates the app to the landing page.
    If the call is unsuccessful, it tells the user why.
  */
  public signin() {
    this.credentials.username = this.loginForm.value.username;
    this.credentials.password = this.loginForm.value.password;
    this.auth.signin(this.credentials).subscribe(() => {
      this.alerts.open("Signed In!");
      this.router.navigateByUrl("/");
    }, (err) => {
      if (err.error && err.error.message && err.error.message === "Username or password incorrect") {
        this.alerts.open(err.error.message);
      } else {
        console.log(err);
        this.router.navigateByUrl("/");
      }
    });
  }

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
