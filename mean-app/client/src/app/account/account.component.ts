import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { AuthenticationService, UsernamePayload, PasswordPayload, TokenPayload } from "../authentication.service";
import { Router } from "@angular/router";
import { SnackbaralertService } from "../snackbaralert.service";

@Component({
  selector: "app-account",
  templateUrl: "./account.component.html",
  styleUrls: ["./account.component.css"]
})
export class AccountComponent implements OnInit {
  userForm: FormGroup;
  passwordForm: FormGroup;
  deleteForm: FormGroup;
  updateUsername: UsernamePayload = {
    oldUsername: "",
    newUsername: "",
    password: ""
  };
  updatePassword: PasswordPayload = {
    username: "",
    oldPassword: "",
    newPassword: ""
  };
  deleteAccount: TokenPayload = {
    username: "",
    password: ""
  };

  constructor(private auth: AuthenticationService, private router: Router,
  private alerts: SnackbaralertService, private builder: FormBuilder) {
    this.userForm = this.builder.group({
      newUsername: ["", Validators.required],
      password: ["", Validators.required]
    });
    this.passwordForm = this.builder.group({
      oldPassword: ["", Validators.required],
      newPassword: ["", Validators.required],
      repeatNewPassword: ["", Validators.required]
    });
    this.deleteForm = this.builder.group({
      password: ["", Validators.required]
    });
  }

  public isValid(object: string) {
    if (object === "user" && this.userForm.value.newUsername && this.userForm.value.password) {
      return true;
    }
    else if (object === "password" && this.passwordForm.value.oldPassword && this.passwordForm.value.newPassword && this.passwordForm.value.repeatNewPassword) {
      return true;
    }
    return false;
  }

  //calls the changeUsername function in the auth service
  public onUsername() {
    this.updateUsername.oldUsername = this.auth.getUsername();
    this.updateUsername.newUsername = this.userForm.value.newUsername;
    this.updateUsername.password = this.userForm.value.password;
    this.auth.changeUsername(this.updateUsername).subscribe(() => {
      this.updateUsername.oldUsername = this.updateUsername.newUsername;
      this.alerts.open("Username successfully updated");
      this.userForm.reset();
      Object.keys(this.userForm.controls).forEach(key => { //workaround
        this.userForm.controls[key].setErrors(null);
      });
    }, (err) => {
      if (err.error && err.error.code && err.error.code === 11000) { //Mongo error code that means duplicate key constraint violation
        this.alerts.open("Sorry, that username has already been taken. Please try another!");
      } else if (err.error && err.error.message) { //alerts the error
        this.alerts.open(err.error.message);
      } else {
        this.alerts.open(err);
        this.router.navigateByUrl("/");
      }
    });
  }

  //calls the changePassword function in the auth service
  public onPassword() {
    this.updatePassword.username = this.auth.getUsername();
    if (this.passwordForm.value.newPassword === this.passwordForm.value.repeatNewPassword) { //if the two supposedly identical passwords match
      this.updatePassword.oldPassword = this.passwordForm.value.oldPassword;
      this.updatePassword.newPassword = this.passwordForm.value.newPassword;
      this.auth.changePassword(this.updatePassword).subscribe(() => {
        this.alerts.open("Password successfully updated!");
        this.passwordForm.reset();
        Object.keys(this.passwordForm.controls).forEach(key => { //workaround
          this.passwordForm.controls[key].setErrors(null);
        });
      }, (err) => {
        if (err.error && err.error.message) { //alerts the error
          this.alerts.open(err.error.message);
        } else {
          this.router.navigateByUrl("/");
        }
      });
    } else {
      this.alerts.open("New passwords do not match.");
    }
  }

  //calls the deleteProfile function in the auth service
  public onDelete() {
    this.deleteAccount.username = this.auth.getUsername();
    this.deleteAccount.password = this.deleteForm.value.password;
    this.auth.deleteProfile(this.deleteAccount).subscribe(() => {
      this.alerts.open("This account has been deleted.");
      this.auth.signout();
      this.router.navigateByUrl("/");
    }, (err) => {
      if (err.error && err.error.message) {
        this.alerts.open(err.error.message);
      } else {
        this.router.navigateByUrl("/");
      }
    });
  }

  ngOnInit() {
    this.auth.callUpdateColor("account");
    if (!this.auth.isLoggedIn()) {
      this.alerts.open("Please sign in before accessing this page.")
      this.router.navigateByUrl("/signin");
    }
    this.updateUsername.oldUsername = this.auth.getUsername();
  }

}
