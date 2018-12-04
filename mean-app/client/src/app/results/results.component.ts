import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '../authentication.service';
//import { OpportunityformService, TokenPayload } from '../opportunityform.service';
import { ResultService } from '../result.service';
import { Router } from '@angular/router';
import Opportunity from '../Opportunity';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})

export class ResultsComponent implements OnInit {
  username: string;
  opportunities: Opportunity[];
  zillowAverage: string;
  debtChart = [];
  salaryChart = [];
  constructor(private authService: AuthenticationService,
              private resultService: ResultService,
              private router: Router) { }
  generateCharts() {
    this.resultService.getChartsData(this.username).subscribe((data: Opportunity[]) => {
      this.opportunities = data['opportunities'];
      // To get a better idea of what this.opportunities looks like so that you can better access its elements,
      // uncomment the line below and then open up the developer tools on your browser and look in the console.
      //console.log(this.opportunities);
      
      // To make this a meaningful graph, the data.labels and the data.datasets.data fields will need to be populated
      // using information stored in this.opportunities.
      this.debtChart = new Chart('canvas0', {
        type: 'bar',
        data: {
          labels: ["0", "1", "2"],
          datasets: [{
            label: "Debt Chart",
            data: [21, 22, 23]
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

      // To make this a meaningful graph, the data.labels and the data.datasets.data fields will need to be populated
      // using information stored in this.opportunities.
      this.salaryChart = new Chart('canvas1', {
        type: 'bar',
        data: {
          labels: ["0", "1", "2"],
          datasets: [{
            label: "Salary Chart",
            data: [21, 22, 23]
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
  displayZillowData() {
    this.resultService.getZillowData(this.username).subscribe((data: string) => { //TODO not a string
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
