import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { ProfileService, Debt } from "../profile.service";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthenticationService } from "../authentication.service";
import { OpportunityService, ShortOpportunity } from "../opportunity.service";
import { SnackbaralertService } from "../snackbaralert.service";

@Component({
  selector: "app-debtedit",
  templateUrl: "./debtedit.component.html",
  styleUrls: ["./debtedit.component.css"]
})
export class DebteditComponent implements OnInit {
  username: String;
  debt: any = {};
  profileForm: FormGroup;
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
    private oppService: OpportunityService, private alerts: SnackbaralertService) {
      this.profileForm = this.builder.group({
        name: ["", Validators.required],
        principal: [0, Validators.required],
        rate: [0],
        annualCompounds: [0],
        monthlyPayment: [0],
        opportunity: ["", Validators.required]
      });
  }

  public isValid() {
    if (this.profileForm.value.name && this.profileForm.value.principal && this.profileForm.value.opportunity) {
      return true;
    }
    return false;
  }

  private updateDebt() {
    this.activatedRouter.params.subscribe(params => {
      this.profService.updateDebt(this.formdata, params["id"]).subscribe(() => {
        this.router.navigate(["debt"]);
      }, (err) => {
        console.log(err);
      });
    });
  }

  public onSubmit() {
    this.formdata.name = this.profileForm.value.name;
    this.formdata.principal = this.profileForm.value.principal;
    this.formdata.rate = this.profileForm.value.rate;
    this.formdata.annualCompounds = this.profileForm.value.annualCompounds;
    this.formdata.monthlyPayment = this.profileForm.value.monthlyPayment;
    this.formdata.opportunity = this.profileForm.value.opportunity;
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

  ngOnInit() {
    this.auth.callUpdateColor("other");
    this.username = this.auth.getUsername();
    if (this.username === null) {
      this.alerts.open("Please fill out the Profile page before accessing this page.");
      window.localStorage.setItem("profile-snackbar", "true");
      this.router.navigateByUrl("/personal");
    } else {
      this.oppService.getShortOpps(this.username).subscribe((data: ShortOpportunity[]) => {
        var selectAll = {
          oppId:"all",
          oppName:"All Opportunities"
        }
        this.oppList.push(selectAll);
        for (var i = 0; i < data["opportunities"].length; ++i) {
          var opp = {
            oppId:data["opportunities"][i]._id,
            oppName:data["opportunities"][i].name
          }
          this.oppList.push(opp);
        }
        this.activatedRouter.params.subscribe(params => {
          this.profService.editDebt(params["id"]).subscribe(res => {
            this.debt = res;
            var opportunityExists = false;
            for (var i = 0; i < this.oppList.length; ++i) {
              if (this.oppList[i].oppId === this.debt.opportunity) {
                opportunityExists = true;
                break;
              }
            }
            if (!opportunityExists) {
              this.debt.opportunity = "";
            }
          });
        });
      });
    }
  }
}
