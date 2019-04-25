import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { ProfileService, Debt } from "../profile.service";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthenticationService } from "../authentication.service";
import { OpportunityService, ShortOpportunity } from "../opportunity.service";
import { SnackbarService } from "../snackbar.service";

@Component({
  selector: "app-debtedit",
  templateUrl: "./debtedit.component.html",
  styleUrls: ["./debtedit.component.css"]
})
export class DebteditComponent implements OnInit {
  username: String;
  debt: any = {};
  debtForm: FormGroup;
  formdata: Debt = {
    username: "",
    name: "",
    principal: 0,
    rate: 0,
    annualCompounds: 0,
    monthlyPayment: 0,
    opportunity: ""
  }
  oppList = [];

  constructor(private activatedRouter: ActivatedRoute,
              private router: Router, private auth: AuthenticationService,
              private profService: ProfileService, private builder: FormBuilder,
              private oppService: OpportunityService, private alerts: SnackbarService) {
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
    This function updates the debt we are editing. It first calls the updateDebt function in the profile service.
    If the call is successful, it navigates back to the debts page.
    If the call is unsuccessful, it tells the user why.
  */
  private updateDebt() {
    this.activatedRouter.params.subscribe(params => {
      this.profService.updateDebt(this.formdata, params["id"]).subscribe(() => {
        this.router.navigate(["debt"]);
      }, (err) => {
        console.log(err);
      });
    });
  }

  /*
    This function is called when the user clicks the Update button. It first sets empty, optional values to 0.
    Then it calls the updateDebt function above.
  */
  public onSubmit() {
    this.formdata.name = this.debtForm.value.name;
    this.formdata.principal = this.debtForm.value.principal;
    this.formdata.rate = this.debtForm.value.rate;
    this.formdata.annualCompounds = this.debtForm.value.annualCompounds;
    this.formdata.monthlyPayment = this.debtForm.value.monthlyPayment;
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
    this.updateDebt();
  }

  /*
    On Init, this page first ensures that the user is logged in.
    Then, this page calls getShortOpportunities in the oppService to get a list of the user's opportunities.
    It then populates the opportunity dropdown with these opportunity names.
    Lastly, it calls editDebt in the profService to get the specific debt that the user has asked to edit.
    If this debt's opportunity no longer exists, it resets this debt's opportunity to "".
  */
  ngOnInit() {
    this.auth.callUpdateColor("other");
    this.username = this.auth.getUsername();
    if (this.username === null) {
      this.alerts.open("Please fill out the Profile page before accessing this page.");
      window.localStorage.setItem("profile-snackbar", "true");
      this.router.navigateByUrl("/profile");
    } else {
      this.oppService.getShortOpportunities(this.username).subscribe((data: ShortOpportunity[]) => { //get the opportunities
        var selectAll = { //this is the option that the user should select if the debt applies to all opportunities
          oppId:"all",
          oppName:"All Opportunities"
        }
        this.oppList.push(selectAll);
        for (var i = 0; i < data["opportunities"].length; ++i) { //add each opportunity to the dropdown
          var opp = {
            oppId:data["opportunities"][i]._id,
            oppName:data["opportunities"][i].name
          }
          this.oppList.push(opp);
        }
        this.activatedRouter.params.subscribe(params => {
          this.profService.editDebt(params["id"]).subscribe(res => { //get the debt for editing
            this.debt = res;
            var opportunityExists = false;
            for (var i = 0; i < this.oppList.length; ++i) {
              if (this.oppList[i].oppId === this.debt.opportunity) { //the debt's opportunity still exists
                opportunityExists = true;
                break;
              }
            }
            if (!opportunityExists) { //the debt's opportunity doesn't exist, so we reset it
              this.debt.opportunity = "";
            }
          });
        });
      });
    }
  }
}
