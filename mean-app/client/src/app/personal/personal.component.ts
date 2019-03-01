import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthenticationService, TokenPayload } from '../authentication.service';
import { ProfileService, Profile, Debt } from '../profile.service';
import { Router } from '@angular/router';
import {MatTableDataSource} from '@angular/material';
import {ViewChild} from '@angular/core';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css']
})
export class PersonalComponent implements OnInit {
  username: String;
  currProfile: any = {};
  debts: Debt[];
  profileFormProfile: FormGroup;
  profileFormDebt: FormGroup;
  formdataProfile: Profile = {
    username: '',
    state: '',
    region: '',
    dependents: 0,
    rent: 0,
    spending: 0,
    pets: 0
  };
  formdataDebt: Debt = {
    username: '',
    principal: 0,
    rate: 0,
    annualCompounds: 0,
    monthlyPayment: 0
  };
  credentials: TokenPayload = {
    username: '',
    password: ''
  };
  dataSource = new MatTableDataSource(this.debts);
  displayedColumns: string[] = ['principal', 'rate', 'annualcompounds', 'monthlypayment', 'edit', 'delete'];

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
    this.profileFormDebt = this.builder.group({
      principal: [0, Validators.required],
      rate: [0, Validators.required],
      annualCompounds: [0, Validators.required],
      monthlyPayment: [0, Validators.required]
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
          this.router.navigate(['opportunity']);
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
        this.router.navigate(['opportunity']);
      }, (err) => {
        console.log(err);
      });
    }
  }

  public onSubmitDebt() {
    this.formdataDebt.principal = this.profileFormDebt.value.principal;
    this.formdataDebt.rate = this.profileFormDebt.value.rate;
    this.formdataDebt.annualCompounds = this.profileFormDebt.value.annualCompounds;
    this.formdataDebt.monthlyPayment = this.profileFormDebt.value.monthlyPayment;
    if (this.username === null) {
      this.auth.register(this.credentials).subscribe(() => {
        this.username = this.auth.getUsername();
        this.formdataDebt.username = this.username;
        this.profService.createDebt(this.formdataDebt).subscribe(() => {
          this.profService.getDebts(this.username).subscribe((data: Debt[]) => {
            this.debts = data['debts'];
            this.dataSource.data = this.debts;
            this.profileFormDebt.reset();
          });
        }, (err) => {
          console.log(err);
          this.profileFormDebt.reset();
        });
      }, (err) => {
        console.log(err);
        this.profileFormDebt.reset();
      });
    }
    else {
      this.formdataDebt.username = this.username;
      this.profService.createDebt(this.formdataDebt).subscribe(() => {
        this.profService.getDebts(this.username).subscribe((data: Debt[]) => {
          this.debts = data['debts'];
          this.dataSource.data = this.debts;
          this.profileFormDebt.reset();
        });
      }, (err) => {
        console.log(err);
        this.profileFormDebt.reset();
      });
    }
  }

  deleteDebt(id: String) {
    this.profService.deleteDebt(this.username, id).subscribe(res => {
      this.profService.getDebts(this.username).subscribe((data: Debt[]) => {
        this.debts = data['debts'];
        this.dataSource.data = this.debts;
      });
    });
  }



  ngOnInit() {
    this.profileFormDebt.reset();
    this.username = this.auth.getUsername();
    if (this.username !== null) {
      this.profService.getProfile(this.username).subscribe(res => {
        this.currProfile = res;
      });
      this.profService.getDebts(this.username).subscribe((data: Debt[]) => {
        this.debts = data['debts'];
        this.dataSource.data = this.debts;
      });
    }
  }
}
