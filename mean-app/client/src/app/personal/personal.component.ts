import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthenticationService, Profile } from '../authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css']
})
export class PersonalComponent implements OnInit {

  currProfile: any = {};

  profileForm = this.fb.group({
    income: ['', Validators.required],
    debt: ['', Validators.required],
    interest: ['', Validators.required],
    payments: ['', Validators.required],
    dependents: ['', Validators.required],
    rent: ['', Validators.required],
    spending: ['', Validators.required],
    pets: ['', Validators.required],
    smoking: ['', Validators.required],
    drinking: ['', Validators.required],
  });

  formdata: Profile = {
    username: "",
    income: 0,
    debt: 0,
    interest: 0,
    payments: 0,
    dependents: 0,
    rent: 0,
    spending: 0,
    pets: 0,
    smoking: false,
    drinking: true
  }

  onSubmit()
  {
  //  var x =  <boolean>this.profileForm.value.smoking;
  //    console.log("submitting", x);
    var user = this.auth.getUsername();
    if (user === null) {
    window.alert("You are not logged in.");
    this.router.navigateByUrl('/');
    } else {
      this.formdata.income = this.profileForm.value.income;
      this.formdata.debt = this.profileForm.value.debt;
      this.formdata.interest = this.profileForm.value.interest;
      this.formdata.payments = this.profileForm.value.payments;
      this.formdata.dependents = this.profileForm.value.dependents;
      this.formdata.rent = this.profileForm.value.rent;
      this.formdata.spending = this.profileForm.value.spending;
      this.formdata.pets = this.profileForm.value.pets;
      this.formdata.smoking = this.profileForm.value.smoking;
      this.formdata.drinking = this.profileForm.value.drinking;
      this.formdata.username = user;
      console.log(this.formdata);
      console.log(user);
      //TODO: also asynchronicity issues here most likely
      this.auth.updateProfile(this.formdata).subscribe(() => {
          this.router.navigate(['opportunity']);
        }, (err) => {
          console.log(err);
        });
    }
}
  constructor(private fb: FormBuilder,
  private router: Router,
  private auth: AuthenticationService) { }

  ngOnInit() { //TODO: Fix syncing issues with get/post
    var username = this.auth.getUsername();
    if (username === null) {
      window.alert("You are not logged in.");
      this.router.navigateByUrl('/');
    } else {
      console.log("Logged in as: ", username);
      this.auth.getProfile(username).subscribe(res => {
        this.currProfile = res;
        console.log("got data ngOnint");
      });
    }
  }

}
