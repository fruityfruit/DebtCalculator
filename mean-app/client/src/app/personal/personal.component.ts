import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthenticationService, TokenPayload } from '../authentication.service';
import { ProfileService, Profile } from '../profile.service';
import { Router } from '@angular/router';
import {ViewChild} from '@angular/core';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css']
})
export class PersonalComponent implements OnInit {
  username: String;
  currProfile: any = {};
  profileFormProfile: FormGroup;
  formdataProfile: Profile = {
    username: '',
    state: '',
    region: '',
    dependents: 0,
    rent: 0,
    spending: 0,
    pets: 0
  };
  credentials: TokenPayload = {
    username: '',
    password: ''
  };

  constructor(private builder: FormBuilder, private router: Router,
    private auth: AuthenticationService, private profService: ProfileService) {
    this.profileFormProfile = this.builder.group({
      state: ['', Validators.required],
      region: ['', Validators.required],
      dependents: [0, Validators.required],
      rent: [0, Validators.required],
      spending: [0, Validators.required],
      pets: [0, Validators.required]
    });
  }

  public onSubmitProfile() {
    this.formdataProfile.dependents = this.profileFormProfile.value.dependents;
    this.formdataProfile.rent = this.profileFormProfile.value.rent;
    this.formdataProfile.spending = this.profileFormProfile.value.spending;
    this.formdataProfile.pets = this.profileFormProfile.value.pets;
    this.formdataProfile.state = this.profileFormProfile.value.state;
    this.formdataProfile.region = this.profileFormProfile.value.region;
    if (this.username === null) {
      this.auth.register(this.credentials).subscribe(() => {
        this.username = this.auth.getUsername();
        this.formdataProfile.username = this.username;
        this.profService.updateProfile(this.formdataProfile).subscribe(() => {
          this.router.navigate(['debt']);
        }, (err) => {
          console.log(err);
        });
      }, (err) => {
        console.log(err);
      });
    }
    else {
      this.formdataProfile.username = this.username;
      this.profService.updateProfile(this.formdataProfile).subscribe(() => {
        this.router.navigate(['debt']);
      }, (err) => {
        console.log(err);
      });
    }
  }

  ngOnInit() {
    this.username = this.auth.getUsername();
    if (this.username !== null) {
      this.profService.getProfile(this.username).subscribe(res => {
        this.currProfile = res;
      });
    }
  }
}
