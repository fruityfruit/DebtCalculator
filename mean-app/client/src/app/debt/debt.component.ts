import { Component, OnInit } from "@angular/core";
import {MatTableDataSource} from "@angular/material";
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { AuthenticationService } from "../authentication.service";
import { ProfileService, Debt } from "../profile.service";
import { OpportunityService, ShortOpportunity } from "../opportunity.service";
import { Router } from "@angular/router";
import { SnackbaralertService } from "../snackbaralert.service";

@Component({
  selector: "app-debt",
  templateUrl: "./debt.component.html",
  styleUrls: ["./debt.component.css"]
})
export class DebtComponent implements OnInit {
  username: String;
  profileFormDebt: FormGroup;
  formdataDebt: Debt = {
    username: "",
    name: "",
    principal: 0,
    rate: 0,
    annualCompounds: 0,
    monthlyPayment: 0,
    opportunity: ""
  };
  debts: Debt[];
  opportunities: ShortOpportunity[];
  dataSource = new MatTableDataSource(this.debts);
  oppList = [];
  displayedColumns: string[] = ["name", "principal", "rate", "monthlypayment", "edit", "delete"];

  constructor(private builder: FormBuilder, private router: Router,
    private auth: AuthenticationService, private profService: ProfileService,
    private alerts: SnackbaralertService, private oppService: OpportunityService) {
    this.profileFormDebt = this.builder.group({
      name: ["", Validators.required],
      principal: [0, Validators.required],
      rate: [0],
      annualCompounds: [0],
      monthlyPayment: [0],
      opportunity: ["", Validators.required]
    });
  }

  public isValid() {
    if (this.profileFormDebt.value.name && this.profileFormDebt.value.principal && this.profileFormDebt.value.opportunity) {
      return true;
    }
    return false;
  }

  public onSubmitDebt() {
    this.formdataDebt.name = this.profileFormDebt.value.name;
    this.formdataDebt.principal = this.profileFormDebt.value.principal;
    this.formdataDebt.rate = this.profileFormDebt.value.rate;
    if (this.profileFormDebt.value.annualCompounds) {
      this.formdataDebt.annualCompounds = this.profileFormDebt.value.annualCompounds;
    } else {
      this.formdataDebt.annualCompounds = 0;
    }
    if (this.profileFormDebt.value.monthlyPayment) {
      this.formdataDebt.monthlyPayment = this.profileFormDebt.value.monthlyPayment;
    } else {
      this.formdataDebt.monthlyPayment = 0;
    }
    this.formdataDebt.username = this.username;
    this.formdataDebt.opportunity = this.profileFormDebt.value.opportunity;
    this.profService.createDebt(this.formdataDebt).subscribe(() => {
      this.profService.getDebts(this.username).subscribe((data: Debt[]) => {
        this.debts = data["debts"];
        this.dataSource.data = this.debts;
        this.profileFormDebt.reset();
        Object.keys(this.profileFormDebt.controls).forEach(key => { //workaround
          this.profileFormDebt.controls[key].setErrors(null);
        });
      });
    }, (err) => {
      console.log(err);
      this.profileFormDebt.reset();
      Object.keys(this.profileFormDebt.controls).forEach(key => { //workaround
        this.profileFormDebt.controls[key].setErrors(null);
      });
    });
  }

  public deleteDebt(id: String) {
    this.profService.deleteDebt(this.username, id).subscribe(res => {
      this.profService.getDebts(this.username).subscribe((data: Debt[]) => {
        this.debts = data["debts"];
        this.dataSource.data = this.debts;
      });
    });
  }

  ngOnInit() {
    this.auth.callUpdateColor("debts");
    this.profileFormDebt.reset();
    Object.keys(this.profileFormDebt.controls).forEach(key => { //workaround
      this.profileFormDebt.controls[key].setErrors(null);
    });
    this.username = this.auth.getUsername();
    if (this.username === null) {
      this.alerts.open("Please fill out the Profile page before accessing this page.");
      window.localStorage.setItem("profile-snackbar", "true");
      this.router.navigateByUrl("/personal");
    } else {
      this.oppService.getShortOpps(this.username).subscribe((data: ShortOpportunity[]) => {
        this.opportunities = data["opportunities"];
        var selectAll = {
          oppId:"all",
          oppName:"Select All"
        }
        this.oppList.push(selectAll);
        for (var i = 0; i < this.opportunities.length; ++i) {
          var opp = {
            oppId:this.opportunities[i]._id,
            oppName:this.opportunities[i].name
          }
          this.oppList.push(opp);
        }
        this.profService.getDebts(this.username).subscribe((data: Debt[]) => {
          this.debts = data["debts"];
          this.dataSource.data = this.debts;
        });
      });
    }
  }

}
