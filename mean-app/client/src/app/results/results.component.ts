import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService, Profile, PasswordPayload, UsernamePayload} from '../authentication.service';
import { OpportunityService, Opportunity } from '../opportunity.service';
import { ResultService, ResultSet } from '../result.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})

export class ResultsComponent implements OnInit {
  username: string;
  zillowResults: ResultSet[] = [];
  debtChart = [];
  salaryChart = [];
  debtProjection=[];
  someProfile: Profile;
  actualProfile: Profile = {
    username: "",
    income: 0,
    debt: 0,
    interest: 0,
    payments: 0,
    dependents: 0,
    rent: 0,
    spending: 0,
    pets: 0,
    smoking: false,
    drinking: true
  };
  newUsername: string;
  newPassword: string;

  constructor(private auth: AuthenticationService,
              private resultService: ResultService,
              private oppService: OpportunityService,
              private router: Router) { }

  private generateCharts() {
    //this gives you auth back in data as a profile type, shows correctly in console
    this.auth.getProfile(this.username).subscribe((data: Profile) => {
    //  console.log(data);
      var intrestRate = data.interest;
      var principle= data.debt;
      //assume yearly intrerest
    //  var debtFiveYears= principle*(1+intrestRate*5);
      var points=[];
      var labels=[];
    //  console.log(debtFiveYears);
      var num = 0;
      while(num<=10){
        labels.push(num);
        points.push(principle*(1+intrestRate*num/100));
        num=num+1;
      }
      //console.log(points);

      this.debtProjection = new Chart('canvas3', {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: "Debt Projection Over 10 Years",
            data: points,
          }]
        },
        options: {
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }
      });
      //this.actualProfile.interest= data.interest;
      //console.log(this.actualProfile.interest);
    });
    //gives back username but not the actualprofile income


    this.resultService.getChartsData(this.username).subscribe((data: Opportunity[]) => {
      var opportunities = data['opportunities'];
      var oppNames = [];
      var oppDebts = [];
      var oppCosts = [];
      opportunities.forEach(function(item, index) {
        oppNames.push(item.oppName);
        oppDebts.push(item.oppDebt);
        oppCosts.push(item.oppCost);
      });

      this.debtChart = new Chart('canvas0', {
        type: 'bar',
        data: {
          labels: oppNames,
          datasets: [{
            label: "Debt From Opportunities Chart",
            data: oppDebts,
          }]
        },
        options: {
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }
      });

      this.salaryChart = new Chart('canvas1', {
        type: 'bar',
        data: {
          labels: oppNames,
          datasets: [{
            label: "Salary Chart",
            data: oppCosts,

          }]
        },
        options: {
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }
      });
    }, (err) => {
      console.log(err);
    });
  }

  private getOpportunityZillow(oppName: string, city: string, id: string) {
      this.resultService.getZillowData(id).subscribe((data) => {
        if (data['average'] > 0) {
          var result: ResultSet = {
            oppName: oppName,
            city: city,
            zillowData: data['average']
          };
          this.zillowResults.push(result);
        }
      }, (err) => {
        var result: ResultSet = {
          oppName: oppName,
          city: city,
          zillowData: 'Zillow does not have estimate data for this city.'
        };
        this.zillowResults.push(result);
      });
  }

  private displayZillowData() {
    this.oppService.getOpportunities(this.username).subscribe((data: Opportunity[]) => {
      var names = [];
      var cities = [];
      var ids = [];
      var counter = 0;
      data['opportunities'].forEach(function(item, index) {
        names.push(item.oppName);
        cities.push(item.cityName);
        ids.push(item._id);
        counter = counter + 1;
      });
      var i;
      for (i = 0; i < counter; i++) {
        this.getOpportunityZillow(names[i], cities[i], ids[i]);
      }
    });
  }

  private register() {
    if (this.newUsername === '' || this.newUsername.search(/dlcptwfcmc/i) > -1) { //the username uses our dummy sequence for temporary usernames
      window.alert("Sorry, that username has already been taken. Please try another!");
    } else {
      var updateUsername: UsernamePayload = {
        oldUsername: this.username,
        newUsername: this.newUsername,
        password: ''
      }
      var updatePassword: PasswordPayload = {
        username: this.newUsername,
        oldPassword: '',
        newPassword: this.newPassword
      }
      this.auth.changeUsername(updateUsername).subscribe(() => {
        this.auth.changePassword(updatePassword).subscribe(() => {
          window.alert("Registered!");
          this.auth.callUpdateLink();
        }, (err) => {
          console.log(err);
        });
      }, (err) => {
        if (err.error.code === 11000) {
          window.alert("Sorry, that username has already been taken. Please try another!");
        } else {
          console.log(err);
          this.router.navigateByUrl('/');
        }
      });
    }
  }

  private displayBLSData() {
    this.oppService.getOpportunities(this.username).subscribe((data: Opportunity[]) => {
      var codes = [];
      var names = [];
      data['opportunities'].forEach(function(item, index) {
        names.push(item.oppName);
        codes.push(item.code);
        console.log(item.code);
      });
      this.resultService.getBLSData(codes).subscribe((data) => {
        console.log(data);
      }, (err) => {
        console.log(err);
      });
    });
  }

  ngOnInit() {
    this.username = this.auth.getUsername();
    if (this.username === null) {
      window.alert("Please fill out the Personal page before accessing this page.");
      this.router.navigateByUrl('/personal');
    } else {
      this.generateCharts();
      this.displayZillowData();
      this.displayBLSData();
    }
  }

}
