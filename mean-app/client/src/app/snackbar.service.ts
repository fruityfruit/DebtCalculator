import { Injectable } from "@angular/core";
import { MatSnackBar, MatSnackBarConfig } from "@angular/material";

@Injectable({
  providedIn: "root"
})
export class SnackbarService {
  constructor(public snackBar: MatSnackBar) {}

  /*
    This function opens an alert with the passed in message variable as its contents.
    The alert appears at the top of the page and lasts 5 seconds or until dismissed.
  */
  public open(message: string) {
    var action = "OK";
    var config: MatSnackBarConfig = {
      verticalPosition: "top",
      duration: 5000
    };
    this.snackBar.open(message, action, config);
  }

  /*
    This function opens an alert with a predefined login alert message.
    The alert appears at the bottom of the page and lasts until dismissed.
  */
  public openLoginWarning() {
    var message = "You are not logged in. Any data that you enter here will be lost if you log in later. You will also be able to create a new account after viewing your results.";
    var action = "OK";
    var config: MatSnackBarConfig = {
      verticalPosition: "bottom"
    };
    this.snackBar.open(message, action, config);
  }

  /*
    This function clears the current alert.
  */
  public clearSnack() {
    this.snackBar.dismiss();
  }

}
