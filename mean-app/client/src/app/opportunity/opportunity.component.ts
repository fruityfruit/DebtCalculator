import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { OpportunityformService, TokenPayload } from '../opportunityform.service';
import { AuthenticationService } from '../authentication.service';
import Opportunity from '../Opportunity';
import { Router } from '@angular/router';

@Component({
  selector: 'app-opportunity',
  templateUrl: './opportunity.component.html',
  styleUrls: ['./opportunity.component.css']
})
export class OpportunityComponent implements OnInit {
  opportunities: Opportunity[];
  //types = ['Graduate School', 'Job'];
  formdata: TokenPayload = {
    form_type: '',
    form_oppName: '',
    form_cityName: '',
    form_oppCost: '',
    form_oppDebt: '',
    form_move: '',
    form_user: ''
  }

  profileForm = this.fb.group({
    type: ['', Validators.required],
    oppName: ['', Validators.required],
    cityName: ['', Validators.required],
    oppCost: ['', Validators.required],
    oppDebt: ['', Validators.required],
    move: ['', Validators.required],
  });

  onSubmit() {
    // TODO: Use EventEmitter with form value
    var username = this.authService.getUsername();
    if (username === null) {
      window.alert("You are not logged in.");
      this.router.navigateByUrl('/');
    } else {
      //console.log(this.profileForm.value);
      this.formdata.form_type = this.profileForm.value.type;
      this.formdata.form_oppName = this.profileForm.value.oppName;
      this.formdata.form_cityName = this.profileForm.value.cityName;
      this.formdata.form_oppCost = this.profileForm.value.oppCost;
      this.formdata.form_oppDebt = this.profileForm.value.oppDebt;
      this.formdata.form_move = this.profileForm.value.move;
      this.formdata.form_user = this.authService.getUsername();
      this.os.addOpportunity(this.formdata).subscribe(() => {
        this.os.getOpportunities(this.authService.getUsername()).subscribe((data: Opportunity[]) => {
          this.opportunities = data['opportunities'];
          //console.log("Data passed:", this.opportunities);
        });
      }, (err) => {
        console.log(err);
      });
    }
  }
  constructor(private fb: FormBuilder, private os: OpportunityformService,
    private authService: AuthenticationService,
    private router: Router) {  }

  deleteOpportunity(id) {
    var username = this.authService.getUsername();
    if (username === null) {
      window.alert("You are not logged in.");
      this.router.navigateByUrl('/');
    } else {
      this.os.deleteOpportunity(this.authService.getUsername(), id).subscribe(res => {
        this.os.getOpportunities(this.authService.getUsername()).subscribe((data: Opportunity[]) => {
          this.opportunities = data['opportunities'];
        });
      });
    }
  }

  ngOnInit() {
    var username = this.authService.getUsername();
    if (username === null) {
      window.alert("You are not logged in.");
      this.router.navigateByUrl('/');
    } else {
      this.os.getOpportunities(this.authService.getUsername()).subscribe((data: Opportunity[]) => {
          this.opportunities = data['opportunities'];
      });
      //console.log(this.opportunities);
    }

  }

}
