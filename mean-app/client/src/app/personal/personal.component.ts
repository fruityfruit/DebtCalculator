import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthenticationService, Profile, TokenPayload } from '../authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css']
})
export class PersonalComponent implements OnInit {
  username: string;
  currProfile: any = {};
  profileForm: FormGroup;
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
  };
  credentials: TokenPayload = {
    username: '',
    password: ''
  };

  constructor(private builder: FormBuilder, private router: Router,
    private auth: AuthenticationService) {
    this.profileForm = this.builder.group({
      income: ['', Validators.required],
      debt: ['', Validators.required],
      interest: ['', Validators.required],
      payments: ['', Validators.required],
      dependents: ['', Validators.required],
      rent: ['', Validators.required],
      spending: ['', Validators.required],
      pets: ['', Validators.required],
      smoking: [''],
      drinking: [''],
    });
  }

  public onSubmit() {
    this.formdata.income = this.profileForm.value.income;
    this.formdata.debt = this.profileForm.value.debt;
    this.formdata.interest = this.profileForm.value.interest;
    this.formdata.payments = this.profileForm.value.payments;
    this.formdata.dependents = this.profileForm.value.dependents;
    this.formdata.rent = this.profileForm.value.rent;
    this.formdata.spending = this.profileForm.value.spending;
    this.formdata.pets = this.profileForm.value.pets;
    if (this.username === null) {
      this.auth.register(this.credentials).subscribe(() => {
        this.username = this.auth.getUsername();
        this.formdata.username = this.username;
        this.auth.updateProfile(this.formdata).subscribe(() => {
          this.router.navigate(['opportunity']);
        }, (err) => {
          console.log(err);
        });
      }, (err) => {
        console.log(err);
      });
    }
    else {
      this.formdata.username = this.username;
      this.auth.updateProfile(this.formdata).subscribe(() => {
        this.router.navigate(['opportunity']);
      }, (err) => {
        console.log(err);
      });
    }
  }

  ngOnInit() {
    this.username = this.auth.getUsername();
    if (this.username !== null) {
      this.auth.getProfile(this.username).subscribe(res => {
        this.currProfile = res;
      });
    }
  }

}
