import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class SnackbaralertService {
  constructor(public snackBar: MatSnackBar) {}

  public open(message: string) {
    var action = 'OK';
    var config: MatSnackBarConfig = {
      verticalPosition: 'top',
      duration: 5000
    };
    this.snackBar.open(message, action, config);
  }
  public openLoginWarning() {
    var message = 'You are not logged in. Any data that you enter here will be lost if you log in later. You will also be able to create a new account after viewing your results.';
    var action = 'OK';
    var config: MatSnackBarConfig = {
      verticalPosition: 'bottom'
    };
    this.snackBar.open(message, action, config);
  }

}
