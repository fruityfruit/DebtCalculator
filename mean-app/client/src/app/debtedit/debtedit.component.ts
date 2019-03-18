import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ProfileService, Debt } from '../profile.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-debtedit',
  templateUrl: './debtedit.component.html',
  styleUrls: ['./debtedit.component.css']
})
export class DebteditComponent implements OnInit {
  debt: any = {};
  profileForm: FormGroup;
  formdata: Debt = {
    username: '',
    principal: 0,
    rate: 0,
    annualCompounds: 0,
    monthlyPayment: 0
  }

  constructor(private activatedRouter: ActivatedRoute,
    private router: Router,
    private profService: ProfileService,
    private builder: FormBuilder) {
      this.profileForm = this.builder.group({
        principal: ['', Validators.required],
        rate: ['', Validators.required],
        annualCompounds: ['', Validators.required],
        monthlyPayment: ['', Validators.required]
      });
  }

  private updateDebt() {
    this.activatedRouter.params.subscribe(params => {
      this.profService.updateDebt(this.formdata, params['id']).subscribe(() => {
        this.router.navigate(['debt']);
      }, (err) => {
        console.log(err);
      });
    });
  }

  public onSubmit() {
    this.formdata.principal = this.profileForm.value.principal;
    this.formdata.rate = this.profileForm.value.rate;
    this.formdata.annualCompounds = this.profileForm.value.annualCompounds;
    this.formdata.monthlyPayment = this.profileForm.value.monthlyPayment;
    this.updateDebt();
  }

  ngOnInit() {
    this.activatedRouter.params.subscribe(params => {
      this.profService.editDebt(params['id']).subscribe(res => {
        this.debt = res;
      });
    });
  }

}
