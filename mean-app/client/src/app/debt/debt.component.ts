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

  /*
    This function implements custom form validation.
    It returns true if the user has put in a non-empty name, principal amount, and selected an opportunity.
  */
  public isValid() {
    if (this.debtForm.value.name && this.debtForm.value.principal && this.debtForm.value.opportunity) {
      return true;
    }
    return false;
  }

  /*
    This function creates a new debt. It first sets empty, optional values to 0.
    Then it calls the createDebt function in the profile service.
    If the call is successful, it resets the form, updates the contents of the chart, and alerts the user of the success.
    If the call is unsuccessful, it tells the user why and resets the form.
  */
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
        this.dataSource.data = this.debts; //updates the chart
        this.debtForm.reset();
        Object.keys(this.debtForm.controls).forEach(key => { //workaround to prevent erroneous red error warnings
          this.debtForm.controls[key].setErrors(null);
        });
      });
    }, (err) => {
      console.log(err); //logs the error
      this.debtForm.reset();
      Object.keys(this.debtForm.controls).forEach(key => { //workaround to prevent erroneous red error warnings
        this.debtForm.controls[key].setErrors(null);
      });
    });
  }

  /*
    This function deletes a debt. It first calls the deleteDebt function in the profile service.
    If the call is successful, it then calls the getDebts function in the profile service to get all of the user's debts.
    It then updates the debt table.
  */
  public deleteDebt(id: String) {
    this.profService.deleteDebt(this.username, id).subscribe(res => {
      this.profService.getDebts(this.username).subscribe((data: Debt[]) => {
        this.debts = data["debts"];
        this.dataSource.data = this.debts;
      });
    });
  }

  /*
    On Init, this page first ensures that the user is logged in.
    Then, this page calls getShortOpps in the oppService to get a list of the user's opportunities.
    It then populates the opportunity dropdown with these opportunity names.
    Lastly, it calls getDebts in the profService to get all of the user's debts and display them in the debt table.
  */
  ngOnInit() {
    this.auth.callUpdateColor("debts");
    this.debtForm.reset();
    Object.keys(this.debtForm.controls).forEach(key => { //workaround to prevent erroneous red error warnings
      this.debtForm.controls[key].setErrors(null);
    });
    this.username = this.auth.getUsername();
    if (this.username === null) {
      this.alerts.open("Please fill out the Profile page before accessing this page.");
      window.localStorage.setItem("profile-snackbar", "true");
      this.router.navigateByUrl("/personal");
    } else {
      this.oppService.getShortOpps(this.username).subscribe((data: ShortOpportunity[]) => { //get the opportunities
        this.opportunities = data["opportunities"];
        var selectAll = { //this is the option that the user should select if the debt applies to all opportunities
          oppId:"all",
          oppName:"All Opportunities"
        }
        this.oppList.push(selectAll);
        for (var i = 0; i < this.opportunities.length; ++i) { //add each opportunity to the dropdown
          var opp = {
            oppId:this.opportunities[i]._id,
            oppName:this.opportunities[i].name
          }
          this.oppList.push(opp);
        }
        this.profService.getDebts(this.username).subscribe((data: Debt[]) => { //update the debt chart
          this.debts = data["debts"];
          this.dataSource.data = this.debts;
        });
      });
    }
  }

}
