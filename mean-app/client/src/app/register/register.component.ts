import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { AuthenticationService, TokenPayload } from "../authentication.service";
import { Router } from "@angular/router";
import { SnackbaralertService } from "../snackbaralert.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"]
})
export class RegisterComponent implements OnInit {
  profileForm: FormGroup;
  credentials: TokenPayload = {
    username: "",
    password: ""
  }

  constructor(private auth: AuthenticationService, private router: Router,
  private alerts: SnackbaralertService, private builder: FormBuilder) {
    this.profileForm = this.builder.group({
      username: ["", Validators.required],
      password: ["", Validators.required]
    });
  }

  public register() {
    this.credentials.username = this.profileForm.value.username;
    this.credentials.password = this.profileForm.value.password;
    if (this.credentials.username === "" || this.credentials.username.search(/dlcptwfcmc/i) > -1) { //the username uses our dummy sequence for temporary usernames
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

  ngOnInit() {
    this.auth.callUpdateColor("other");
    if (window.localStorage.getItem("persistent-snackbar")) {
      window.localStorage.removeItem("persistent-snackbar");
      this.alerts.clearSnack();
    }
  }

}
