import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService, Profile } from '../authentication.service';
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
  results: ResultSet[] = [];
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

  constructor(private authService: AuthenticationService,
              private resultService: ResultService,
              private oppService: OpportunityService,
              private router: Router) { }

  private generateCharts() {
    //this gives you authservice back in data as a profile type, shows correctly in console
    this.authService.getProfile(this.username).subscribe((data: Profile) => {
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
          this.results.push(result);
        }
      }, (err) => {
        var result: ResultSet = {
          oppName: oppName,
          city: city,
          zillowData: 'Zillow does not have estimate data for this city.'
        };
        this.results.push(result);
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

  ngOnInit() {
    this.username = this.authService.getUsername();
    if (this.username === null) {
      window.alert("You are not logged in.");
      this.router.navigateByUrl('/');
    } else {
      this.generateCharts();
      this.displayZillowData();
    }
  }

}
