import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { OpportunityService, Opportunity } from "../opportunity.service";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthenticationService } from "../authentication.service";
import { SnackbarService } from "../snackbar.service";

@Component({
  selector: "app-oppedit",
  templateUrl: "./oppedit.component.html",
  styleUrls: ["./oppedit.component.css"]
})

export class OppeditComponent implements OnInit {
  opportunity: any = {};
  oppForm: FormGroup;
  formdata: Opportunity = {
    username: "",
    type: "",
    name: "",
    state: "",
    city: "",
    region: "",
    income: 0,
    bonus: 0,
    move: ""
  }
  regionList = [];
  stateList: any = [
    {
      "stateCode": "AL",
      "stateName": "Alabama",
      regionList: [{regionCode:"0300",regionName:"Urban Alabama"},{regionCode:"N300",regionName:"Rural Alabama"}]
    },
    {
      "stateCode": "AK",
      "stateName": "Alaska",
      regionList: [{regionCode:"S49G",regionName:"Urban Alaska"},{regionCode:"N400",regionName:"Rural Alaska"}]
    },
    {
      "stateCode": "AZ",
      "stateName": "Arizona",
      regionList: [{regionCode:"S48A",regionName:"Phoenix-Mesa-Scottsdale"},{regionCode:"0400",regionName:"Urban Arizona"},{regionCode:"N400",regionName:"Rural Arizona"}]
    },
    {
      "stateCode": "AR",
      "stateName": "Arkansas",
      regionList: [{regionCode:"0300",regionName:"Urban Arkansas"},{regionCode:"N300",regionName:"Rural Arkansas"}]
    },
    {
      "stateCode": "CA",
      "stateName": "California",
      regionList: [{regionCode:"S49E",regionName:"San Diego-Carlsbad"},{regionCode:"S49C",regionName:"Riverside-San Bernardino-Ontario"},{regionCode:"S49B",regionName:"San Francisco-Oakland-Hayward"},{regionCode:"S49A",regionName:"Los Angeles-Long Beach-Anaheim"},{regionCode:"A421",regionName:"Los Angeles-Riverside-Orange County"},{regionCode:"0400",regionName:"Urban California"},{regionCode:"N400",regionName:"Rural California"}]
    },
    {
      "stateCode": "CO",
      "stateName": "Colorado",
      regionList: [{regionCode:"S48B",regionName:"Denver-Aurora-Lakewood"},{regionCode:"0400",regionName:"Urban Colorado"},{regionCode:"N400",regionName:"Rural Colorado"}]
    },
    {
      "stateCode": "CT",
      "stateName": "Connecticut",
      regionList: [{regionCode:"0100",regionName:"Urban Connecticut"},{regionCode:"N100",regionName:"Rural Connecticut"}]
    },
    {
      "stateCode": "DE",
      "stateName": "Delaware",
      regionList: [{regionCode:"S12B",regionName:"Philadelphia-Camden-Wilmington"},{regionCode:"0100",regionName:"Urban Delaware"},{regionCode:"N100",regionName:"Rural Delaware"}]
    },
    {
      "stateCode": "DC",
      "stateName": "District of Columbia",
      regionList: [{regionCode:"S35A",regionName:"Washington-Arlington-Alexandria"},{regionCode:"A311",regionName:"Washington-Baltimore"}]
    },
    {
      "stateCode": "FL",
      "stateName": "Florida",
      regionList: [{regionCode:"S35D",regionName:"Tampa-St. Petersburg-Clearwater"},{regionCode:"S35B",regionName:"Miami-Fort Lauderdale-West Palm Beach"},{regionCode:"0300",regionName:"Urban Florida"},{regionCode:"N300",regionName:"Rural Florida"}]
    },
    {
      "stateCode": "GA",
      "stateName": "Georgia",
      regionList: [{regionCode:"S35C",regionName:"Atlanta-Sandy Springs-Roswell"},{regionCode:"0300",regionName:"Urban Georgia"},{regionCode:"N300",regionName:"Rural Georgia"}]
    },
    {
      "stateCode": "HI",
      "stateName": "Hawaii",
      regionList: [{regionCode:"S49F",regionName:"Urban Hawaii"},{regionCode:"N400",regionName:"Rural Hawaii"}]
    },
    {
      "stateCode": "ID",
      "stateName": "Idaho",
      regionList: [{regionCode:"0400",regionName:"Urban Idaho"},{regionCode:"N400",regionName:"Rural Idaho"}]
    },
    {
      "stateCode": "IL",
      "stateName": "Illinois",
      regionList: [{regionCode:"S24B",regionName:"St. Louis"},{regionCode:"S23A",regionName:"Chicago-Naperville-Elgin"},{regionCode:"0200",regionName:"Urban Illinois"},{regionCode:"N200",regionName:"Rural Illinois"}]
    },
    {
      "stateCode": "IN",
      "stateName": "Indiana",
      regionList: [{regionCode:"S23A",regionName:"Chicago-Naperville-Elgin"},{regionCode:"A213",regionName:"Cincinnati-Hamilton"},{regionCode:"0200",regionName:"Urban Indiana"},{regionCode:"N200",regionName:"Rural Indiana"}]
    },
    {
      "stateCode": "IA",
      "stateName": "Iowa",
      regionList: [{regionCode:"0200",regionName:"Urban Iowa"},{regionCode:"N200",regionName:"Rural Iowa"}]
    },
    {
      "stateCode": "KS",
      "stateName": "Kansas",
      regionList: [{regionCode:"A214",regionName:"Kansas City"},{regionCode:"0200",regionName:"Urban Kansas"},{regionCode:"N200",regionName:"Rural Kansas"}]
    },
    {
      "stateCode": "KY",
      "stateName": "Kentucky",
      regionList: [{regionCode:"A213",regionName:"Cincinnati-Hamilton"},{regionCode:"0200",regionName:"Urban Kentucky"},{regionCode:"N200",regionName:"Rural Kentucky"}]
    },
    {
      "stateCode": "LA",
      "stateName": "Louisiana",
      regionList: [{regionCode:"0300",regionName:"Urban Louisiana"},{regionCode:"N300",regionName:"Rural Louisiana"}]
    },
    {
      "stateCode": "ME",
      "stateName": "Maine",
      regionList: [{regionCode:"0100",regionName:"Urban Maine"},{regionCode:"N100",regionName:"Rural Maine"}]
    },
    {
      "stateCode": "MD",
      "stateName": "Maryland",
      regionList: [{regionCode:"S35E",regionName:"Baltimore-Columbia-Towson"},{regionCode:"S35A",regionName:"Washington-Arlington-Alexandria"},{regionCode:"S12B",regionName:"Philadelphia-Camden-Wilmington"},{regionCode:"A311",regionName:"Washington-Baltimore"},{regionCode:"0100",regionName:"Urban Maryland"},{regionCode:"N100",regionName:"Rural Maryland"}]
    },
    {
      "stateCode": "MA",
      "stateName": "Massachusetts",
      regionList: [{regionCode:"S11A",regionName:"Boston-Cambridge-Newton"},{regionCode:"0100",regionName:"Urban Massachusetts"},{regionCode:"N100",regionName:"Rural Massachusetts"}]
    },
    {
      "stateCode": "MI",
      "stateName": "Michigan",
      regionList: [{regionCode:"S23B",regionName:"Detroit-Warren-Dearborn"},{regionCode:"0200",regionName:"Urban Michigan"},{regionCode:"N200",regionName:"Rural Michigan"}]
    },
    {
      "stateCode": "MN",
      "stateName": "Minnesota",
      regionList: [{regionCode:"S24A",regionName:"Minneapolis-St. Paul-Bloomington"},{regionCode:"0200",regionName:"Urban Minnesota"},{regionCode:"N200",regionName:"Rural Minnesota"}]
    },
    {
      "stateCode": "MS",
      "stateName": "Mississippi",
      regionList: [{regionCode:"0300",regionName:"Urban Mississippi"},{regionCode:"N300",regionName:"Rural Mississippi"}]
    },
    {
      "stateCode": "MO",
      "stateName": "Missouri",
      regionList: [{regionCode:"S24B",regionName:"St. Louis"},{regionCode:"A214",regionName:"Kansas City"},{regionCode:"0200",regionName:"Urban Missouri"},{regionCode:"N200",regionName:"Rural Missouri"}]
    },
    {
      "stateCode": "MT",
      "stateName": "Montana",
      regionList: [{regionCode:"0400",regionName:"Urban Montana"},{regionCode:"N400",regionName:"Rural Montana"}]
    },
    {
      "stateCode": "NE",
      "stateName": "Nebraska",
      regionList: [{regionCode:"0200",regionName:"Urban Nebraska"},{regionCode:"N200",regionName:"Rural Nebraska"}]
    },
    {
      "stateCode": "NV",
      "stateName": "Nevada",
      regionList: [{regionCode:"0400",regionName:"Urban Nevada"},{regionCode:"N400",regionName:"Rural Nevada"}]
    },
    {
      "stateCode": "NH",
      "stateName": "New Hampshire",
      regionList: [{regionCode:"S11A",regionName:"Boston-Cambridge-Newton"},{regionCode:"0100",regionName:"Urban New Hampshire"},{regionCode:"N100",regionName:"Rural New Hampshire"}]
    },
    {
      "stateCode": "NJ",
      "stateName": "New Jersey",
      regionList: [{regionCode:"S12B",regionName:"Philadelphia-Camden-Wilmington"},{regionCode:"S12A",regionName:"New York-Newark-Jersey City"},{regionCode:"0100",regionName:"Urban New Jersey"},{regionCode:"N100",regionName:"Rural New Jersey"}]
    },
    {
      "stateCode": "NM",
      "stateName": "New Mexico",
      regionList: [{regionCode:"0400",regionName:"Urban New Mexico"},{regionCode:"N400",regionName:"Rural New Mexico"}]
    },
    {
      "stateCode": "NY",
      "stateName": "New York",
      regionList: [{regionCode:"S12A",regionName:"New York-Newark-Jersey City"},{regionCode:"0100",regionName:"Urban New York"},{regionCode:"N100",regionName:"Rural New York"}]
    },
    {
      "stateCode": "NC",
      "stateName": "North Carolina",
      regionList: [{regionCode:"0300",regionName:"Urban North Carolina"},{regionCode:"N300",regionName:"Rural North Carolina"}]
    },
    {
      "stateCode": "ND",
      "stateName": "North Dakota",
      regionList: [{regionCode:"0200",regionName:"Urban North Dakota"},{regionCode:"N200",regionName:"Rural North Dakota"}]
    },
    {
      "stateCode": "OH",
      "stateName": "Ohio",
      regionList: [{regionCode:"A213",regionName:"Cincinnati-Hamilton"},{regionCode:"A210",regionName:"Cleveland-Akron"},{regionCode:"0200",regionName:"Urban Ohio"},{regionCode:"N200",regionName:"Rural Ohio"}]

    },
    {
      "stateCode": "OK",
      "stateName": "Oklahoma",
      regionList: [{regionCode:"0200",regionName:"Urban Oklahoma"},{regionCode:"N200",regionName:"Rural Oklahoma"}]
    },
    {
      "stateCode": "OR",
      "stateName": "Oregon",
      regionList: [{regionCode:"A425",regionName:"Portland-Salem"},{regionCode:"0400",regionName:"Urban Oregon"},{regionCode:"N400",regionName:"Rural Oregon"}]
    },
    {
      "stateCode": "PA",
      "stateName": "Pennsylvania",
      regionList: [{regionCode:"S12B",regionName:"Philadelphia-Camden-Wilmington"},{regionCode:"S12A",regionName:"New York-Newark-Jersey City"},{regionCode:"A104",regionName:"Pittsburgh"},{regionCode:"0100",regionName:"Urban Pennsylvania"},{regionCode:"N100",regionName:"Rural Pennsylvania"}]
    },
    {
      "stateCode": "PR",
      "stateName": "Puerto Rico",
      regionList: [{regionCode:"0300",regionName:"Urban Puerto Rico"},{regionCode:"N300",regionName:"Rural Puerto Rico"}]
    },
    {
      "stateCode": "RI",
      "stateName": "Rhode Island",
      regionList: [{regionCode:"0100",regionName:"Urban Rhode Island"},{regionCode:"N100",regionName:"Rural Rhode Island"}]
    },
    {
      "stateCode": "SC",
      "stateName": "South Carolina",
      regionList: [{regionCode:"0300",regionName:"Urban South Carolina"},{regionCode:"N300",regionName:"Rural South Carolina"}]
    },
    {
      "stateCode": "SD",
      "stateName": "South Dakota",
      regionList: [{regionCode:"0200",regionName:"Urban South Dakota"},{regionCode:"N200",regionName:"Rural South Dakota"}]
    },
    {
      "stateCode": "TN",
      "stateName": "Tennessee",
      regionList: [{regionCode:"0300",regionName:"Urban Tennessee"},{regionCode:"N300",regionName:"Rural Tennessee"}]
    },
    {
      "stateCode": "TX",
      "stateName": "Texas",
      regionList: [{regionCode:"S37B",regionName:"Houston-The Woodlands-Sugar Land"},{regionCode:"S37A",regionName:"Dallas-Fort Worth-Arlington"},{regionCode:"0300",regionName:"Urban Texas"},{regionCode:"N300",regionName:"Rural Texas"}]
    },
    {
      "stateCode": "UT",
      "stateName": "Utah",
      regionList: [{regionCode:"0400",regionName:"Urban Utah"},{regionCode:"N400",regionName:"Rural Utah"}]
    },
    {
      "stateCode": "VT",
      "stateName": "Vermont",
      regionList: [{regionCode:"0100",regionName:"Urban Vermont"},{regionCode:"N100",regionName:"Rural Vermont"}]
    },
    {
      "stateCode": "VA",
      "stateName": "Virginia",
      regionList: [{regionCode:"S35A",regionName:"Washington-Arlington-Alexandria"},{regionCode:"A311",regionName:"Washington-Baltimore"},{regionCode:"0300",regionName:"Urban Virginia"},{regionCode:"N300",regionName:"Rural Virginia"}]
    },
    {
      "stateCode": "WA",
      "stateName": "Washington",
      regionList: [{regionCode:"S49D",regionName:"Seattle-Tacoma-Bellevue"},{regionCode:"A425",regionName:"Portland-Salem"},{regionCode:"0400",regionName:"Urban Washington"},{regionCode:"N400",regionName:"Rural Washington"}]
    },
    {
      "stateCode": "WV",
      "stateName": "West Virginia",
      regionList: [{regionCode:"S35A",regionName:"Washington-Arlington-Alexandria"},{regionCode:"A311",regionName:"Washington-Baltimore"},{regionCode:"0100",regionName:"Urban West Virginia"},{regionCode:"N100",regionName:"Rural West Virginia"}]

    },
    {
      "stateCode": "WI",
      "stateName": "Wisconsin",
      regionList: [{regionCode:"S24A",regionName:"Minneapolis-St. Paul-Bloomington"},{regionCode:"S23A",regionName:"Chicago-Naperville-Elgin"},{regionCode:"A212",regionName:"Milwaukee-Racine"},{regionCode:"0200",regionName:"Urban Wisconsin"},{regionCode:"N200",regionName:"Rural Wisconsin"}]
    },
    {
      "stateCode": "WY",
      "stateName": "Wyoming",
      regionList: [{regionCode:"0400",regionName:"Urban Wyoming"},{regionCode:"N400",regionName:"Rural Wyoming"}]
    },
  ];

  constructor(private activatedRouter: ActivatedRoute, private router: Router,
              private auth: AuthenticationService, private oppService: OpportunityService,
              private builder: FormBuilder, private alerts: SnackbarService) {
      this.oppForm = this.builder.group({
        type: ["", Validators.required],
        name: ["", Validators.required],
        city: ["", Validators.required],
        state: ["", Validators.required],
        region: ["", Validators.required],
        income: [0],
        bonus: [0],
        move: ["", Validators.required]
      });
    }

  /*
    This function updates the opportunity we are editing. It first calls the updateOpportunity function in the opportunity service.
    If the call is successful, it navigates back to the opportunities page.
    If the call is unsuccessful, it tells the user why.
  */
  private updateOpportunity() {
    this.activatedRouter.params.subscribe(params => {
      this.oppService.updateOpportunity(this.formdata, params["id"]).subscribe(() => {
        this.router.navigate(["opportunity"]);
      }, (err) => {
        console.log(err);
      });
    });
  }

  /*
    This function is called when the user clicks the Update button. It first sets empty, optional values to 0.
    Then it calls the updateOpportunity function above.
  */
  public onSubmit() {
    this.formdata.type = this.oppForm.value.type;
    this.formdata.name = this.oppForm.value.name;
    this.formdata.city = this.oppForm.value.city;
    this.formdata.state = this.oppForm.value.state;
    this.formdata.region = this.oppForm.value.region;
    this.formdata.income = this.oppForm.value.income;
    this.formdata.bonus = this.oppForm.value.bonus;
    this.formdata.move = this.oppForm.value.move;
    if (!this.formdata.income) {
      this.formdata.income = 0;
    }
    if (!this.formdata.bonus) {
      this.formdata.bonus = 0;
    }
    this.updateOpportunity();
  }

  /*
    This function populates the region dropdown, which is dependent upon the state dropdown.
  */
  public changeRegionList(stateCode) {
    let dropDownData = this.stateList.find((data: any) => data.stateCode === stateCode);
    if (dropDownData) {
      this.regionList = dropDownData.regionList;
    } else {
      this.regionList = [];
    }
  }

  /*
    On Init, this page first ensures that the user is logged in.
    Then it calls editOpportunity in the opportunity service to get the specific opportunity that the user has asked to edit.
    It finally calls changeRegionList to populate the region dropdown data.
  */
  ngOnInit() {
    this.auth.callUpdateColor("other");
    var username = this.auth.getUsername();
    if (username === null) {
      this.alerts.open("Please fill out the Profile page before accessing this page.");
      window.localStorage.setItem("profile-snackbar", "true");
      this.router.navigateByUrl("/profile");
    } else {
      this.activatedRouter.params.subscribe(params => {
        this.oppService.editOpportunity(params["id"]).subscribe(res => {
          this.opportunity = res;
          this.changeRegionList(this.opportunity.state);
        });
      });
    }
  }
}
