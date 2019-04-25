import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { AuthenticationService, TokenPayload } from "../authentication.service";
import { Router } from "@angular/router";
import { SnackbarService } from "../snackbar.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"]
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  credentials: TokenPayload = {
    username: "",
    password: ""
  }

  constructor(private auth: AuthenticationService, private router: Router,
              private alerts: SnackbarService, private builder: FormBuilder) {
    this.registerForm = this.builder.group({
      username: ["", Validators.required],
      password: ["", Validators.required]
    });
  }

  /*
    This function registers a user for a new account. It first checks whether the user has entered a known invalid username.
    It calls the register function in the auth service to actually register the user.
    If the call is successful, it alerts the user and navigates the app to the landing page.
    If the call is unsuccessful, it tells the user why.
  */
  public register() {
    this.credentials.username = this.registerForm.value.username;
    this.credentials.password = this.registerForm.value.password;
    if (this.credentials.username === "" || this.credentials.username.search(/dlcptwfcmc/i) > -1) { //the username uses our sequence for temporary usernames
      this.alerts.open("Sorry, that username has already been taken. Please try another!");
    } else {
      this.auth.register(this.credentials).subscribe(() => {
        this.alerts.open("Registered!");
        this.router.navigateByUrl("/");
      }, (err) => {
        if (err.error.code === 11000) { //Mongo error code that means duplicate key constraint violation
          this.alerts.open("Sorry, that username has already been taken. Please try another!");
        } else {
          console.log(err);
          this.router.navigateByUrl("/");
        }
      });
    }
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
