import { Component, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material";
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
  debtForm: FormGroup;
  formdata: Debt = {
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
    this.debtForm = this.builder.group({
      name: ["", Validators.required],
      principal: [0, Validators.required],
      rate: [0],
      annualCompounds: [0],
      monthlyPayment: [0],
      opportunity: ["", Validators.required]
    });
  }

  public isValid() {
    if (this.debtForm.value.name && this.debtForm.value.principal && this.debtForm.value.opportunity) {
      return true;
    }
    return false;
  }

  public onSubmitDebt() {
    this.formdata.name = this.debtForm.value.name;
    this.formdata.principal = this.debtForm.value.principal;
    this.formdata.rate = this.debtForm.value.rate;
    this.formdata.annualCompounds = this.debtForm.value.annualCompounds;
    this.formdata.monthlyPayment = this.debtForm.value.monthlyPayment;
    this.formdata.username = this.username;
    this.formdata.opportunity = this.debtForm.value.opportunity;
    if (!this.formdata.rate) {
      this.formdata.rate = 0;
    }
    if (!this.formdata.annualCompounds) {
      this.formdata.annualCompounds = 0;
    }
    if (!this.formdata.monthlyPayment) {
      this.formdata.monthlyPayment = 0;
    }
    this.profService.createDebt(this.formdata).subscribe(() => {
      this.profService.getDebts(this.username).subscribe((data: Debt[]) => {
        this.debts = data["debts"];
        this.dataSource.data = this.debts;
        this.debtForm.reset();
        Object.keys(this.debtForm.controls).forEach(key => { //workaround
          this.debtForm.controls[key].setErrors(null);
        });
      });
    }, (err) => {
      console.log(err);
      this.debtForm.reset();
      Object.keys(this.debtForm.controls).forEach(key => { //workaround
        this.debtForm.controls[key].setErrors(null);
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
    this.debtForm.reset();
    Object.keys(this.debtForm.controls).forEach(key => { //workaround
      this.debtForm.controls[key].setErrors(null);
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
          oppName:"All Opportunities"
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
