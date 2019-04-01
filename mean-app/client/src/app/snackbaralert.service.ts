import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class SnackbaralertService {
  private config: MatSnackBarConfig = {
    verticalPosition: 'top',
    duration: 5000
  };
  constructor(public snackBar: MatSnackBar) {}

  public open(message) {
    var action = 'OK';
    this.snackBar.open(message, action, this.config);
  }

}
