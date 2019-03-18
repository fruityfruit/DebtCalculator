import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthenticationService } from '../authentication.service';
import { ProfileService, Debt } from '../profile.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-debt',
  templateUrl: './debt.component.html',
  styleUrls: ['./debt.component.css']
})
export class DebtComponent implements OnInit {
  username: String;
  profileFormDebt: FormGroup;
  formdataDebt: Debt = {
    username: '',
    principal: 0,
    rate: 0,
    annualCompounds: 0,
    monthlyPayment: 0
  };
  debts: Debt[];
  dataSource = new MatTableDataSource(this.debts);
  displayedColumns: string[] = ['principal', 'rate', 'annualcompounds', 'monthlypayment', 'edit', 'delete'];

  constructor(private builder: FormBuilder, private router: Router,
    private auth: AuthenticationService, private profService: ProfileService) {
    this.profileFormDebt = this.builder.group({
      principal: [0, Validators.required],
      rate: [0, Validators.required],
      annualCompounds: [0, Validators.required],
      monthlyPayment: [0, Validators.required]
    });
  }

  public onSubmitDebt() {
    this.formdataDebt.principal = this.profileFormDebt.value.principal;
    this.formdataDebt.rate = this.profileFormDebt.value.rate;
    this.formdataDebt.annualCompounds = this.profileFormDebt.value.annualCompounds;
    this.formdataDebt.monthlyPayment = this.profileFormDebt.value.monthlyPayment;
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
    if (this.username === null) {
      window.alert("Please fill out the Personal page before accessing this page.");
      this.router.navigateByUrl('/personal');
    } else {
      this.profService.getDebts(this.username).subscribe((data: Debt[]) => {
        this.debts = data['debts'];
        this.dataSource.data = this.debts;
      });
    }
  }

}
