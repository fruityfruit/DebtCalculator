import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '../authentication.service';
import { OpportunityService, Opportunity } from '../opportunity.service';
import { ResultService } from '../result.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})

export class ResultsComponent implements OnInit {
  username: string;
  zillowAverage: number;
  debtChart = [];
  salaryChart = [];

  constructor(private authService: AuthenticationService,
              private resultService: ResultService,
              private router: Router) { }

  private generateCharts() {
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
            label: "Debt Chart",
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

  private displayZillowData() {
    this.resultService.getZillowData(this.username).subscribe((data) => {
      this.zillowAverage = data['average'];
    }, (err) => {
      console.log(err);
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
