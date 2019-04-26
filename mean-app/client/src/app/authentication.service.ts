import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import * as Rx from "rxjs";
import { Router } from "@angular/router";
import { SnackbarService } from "./snackbar.service";

export interface PasswordPayload {
  username: String;
  oldPassword: String;
  newPassword: String;
}

export interface UsernamePayload {
  oldUsername: String;
  newUsername: String;
  password: String;
}

export interface TokenPayload {
  password: String;
  username: String;
}

interface TokenResponse {
  token: string;
  username: string;
}

@Injectable({
  providedIn: "root"
})
export class AuthenticationService {
  private token: String;
  private username: String = "";
  public invokeEvent: Rx.Subject<any> = new Rx.Subject(); //used to update the navbar

  constructor(private http: HttpClient, private router: Router, private alerts: SnackbarService) {}

  /*
    This function saves a token and the time at which it was saved to the user's browser's cookies.
  */
  private saveToken(token: string) {
    var date = new Date();
    localStorage.setItem("debt-calc-token", (date.getTime()+":"+token));
    this.token = token;
  }

  /*
    This function saves a user's username to the user's browser's cookies.
  */
  private saveUsername(username: string) {
    localStorage.setItem("debt-calc-username", username);
    this.username = username;
  }

  /*
    This function makes and handles the API post requests required for a user to login and logout.
  */
  private post(type: "signin"|"register"|"username"|"password", user) { //can only handle signin, register, username, and password post requests
    var apiResponse = this.http.post(`/api/${type}`, user); //makes the API call
    const pipedResponse = apiResponse.pipe(
      map((data: TokenResponse) => { //expects a TokenResponse to have been returned
        if (data.token) {
          this.saveToken(data.token); //saves the token
        }
        if (data.username) {
          this.saveUsername(data.username); //saves the username
        }
        return data;
      })
    );
    return pipedResponse;
  }

  /*
    This function calls the post function above to register a new user.
  */
  public register(user: TokenPayload) {
    return this.post("register", user);
  }

  /*
    This function calls the post function above to sign a user in.
  */
  public signin(user: TokenPayload) {
    return this.post("signin", user);
  }

  /*
    This function calls the post function above to change a user's username.
  */
  public changeUsername(user: UsernamePayload) {
    return this.post("username", user);
  }

  /*
    This function calls the post function above to change a user's password.
  */
  public changePassword(user: PasswordPayload) {
    return this.post("password", user);
  }

  /*
    This function makes an API call to the app's backend delete a user's account.
  */
  public deleteProfile(user: TokenPayload) {
    return this.http.post(`/api/delete`, user);
  }

  /*
    This function signs a user out by clearing the cookies corresponding to their signed-in token and username.
  */
  public signout() {
    this.token = "";
    this.username = "";
    window.localStorage.removeItem("debt-calc-token");
    window.localStorage.removeItem("debt-calc-username");
  }

  /*
    This function returns the user's username, if applicable, or returns null if the user has not created a profile.
  */
  public getUsername() {
    if (window.localStorage.getItem("debt-calc-username")) {
      return window.localStorage.getItem("debt-calc-username");
    } else {
      return null;
    }
  }

  /*
    This function determines whether a user is logged in.
    If the user has a login token that is less than 6 hours old, it returns true.
    If the user has a login token that is expired, it alerts them that they have been logged out due to inactivity, navigates to the landing page, and returns false.
    If the user has no token, it returns false.
  */
  public isLoggedIn() {
    if (window.localStorage.getItem("debt-calc-token")) {
      var oldTime = window.localStorage.getItem("debt-calc-token");
      oldTime = oldTime.substring(0, oldTime.indexOf(":"));
      var date = new Date();
      var newTime = date.getTime();
      if (newTime - Number(oldTime) > 21600000) { //the login token is at least six hours old
        this.signout();
        this.alerts.open("You have been logged out due to inactivity.");
        this.router.navigateByUrl("/home");
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

  /*
    This function calls the updateColor method in the navbar component.
  */
  public callUpdateColor(text: string) {
    this.invokeEvent.next(text);
  }

  /*
    This function takes a number and whether or not decimal places are desired.
    It returns a string version of that number with commas, dollar signs, and decimals in the appropriate places.
  */
  public formatMoney(money: number, decimal: boolean) {
    var formattedString = "";
    if (money < 0) {
      money = money * -1;
      formattedString = "-";
    }
    var roundedMoney = String(money.toFixed(2));
    var leadDigits = 0;
    if (roundedMoney.substr(0,roundedMoney.indexOf(".")).length > 3) leadDigits = (roundedMoney.length % 3);
    formattedString = formattedString + "$" + (leadDigits ? roundedMoney.substr(0, leadDigits) + "," : "") + roundedMoney.substr(leadDigits).replace(/(\d{3})(?=\d)/g, "$1" + ",");
    if (!decimal) {
      formattedString = formattedString.substring(0,formattedString.length-3);
    }
    return formattedString;
  }
}
