import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Chart } from 'chart.js';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService, PasswordPayload, UsernamePayload} from '../authentication.service';
import { OpportunityService, Opportunity } from '../opportunity.service';
import { ResultService, ResultSet } from '../result.service';
import { ProfileService, Profile, Debt } from '../profile.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material';
import { SnackbaralertService } from '../snackbaralert.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})

export class ResultsComponent implements OnInit {
  username: string = '';
  zillowResults: ResultSet[] = [];
  blsChart = [] as Chart;
  debtProjection = [] as Chart;
  netIncome = [] as Chart;
  profile: Profile = {
    username: "",
    state: "",
    region: "",
    dependents: 0,
    rent: 0,
    spending: 0,
    pets: 0
  };
  debts: Debt[] = [];
  opportunities: Opportunity[] = [];
  newUsername: string;
  newPassword: string;
  profileForm: FormGroup;
  dataSource = new MatTableDataSource(this.zillowResults);
  displayedColumns: string[] = ['name', 'city', 'estimate'];
  colors=['darkgreen','aqua','indigo','maroon','skyblue','magenta','pink','gold','salmon','mediumseagreen'];

  constructor(public auth: AuthenticationService, private resultService: ResultService,
    private oppService: OpportunityService, private profService: ProfileService,
    private builder: FormBuilder, private router: Router, private alerts: SnackbaralertService) {
    this.profileForm = this.builder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  private getData() {
    this.profService.getProfile(this.username).subscribe((data: any) => { //returns the user's profile
      this.profile.username = this.username;
      this.profile.state = data.state;
      this.profile.region = data.region;
      this.profile.dependents = data.dependents;
      this.profile.rent = data.rent;
      this.profile.spending = data.spending;
      this.profile.pets = data.pets;
      this.resultService.getChartsData(this.username).subscribe((data: any) => { //returns the debts and opportunities for each user
        var tempUsername = this.username;
        var tempDebts: Debt[] = [];
        var tempOpps: Opportunity[] = [];
        data.debts.forEach(function(entry) {
          var newDebt: Debt = {
            username: tempUsername,
            name: entry.name,
            principal: entry.principal,
            rate: entry.rate,
            annualCompounds: entry.annualCompounds,
            monthlyPayment: entry.monthlyPayment
          };
          tempDebts.push(newDebt);
        });
        this.debts = tempDebts;
        data.opportunities.forEach(function(entry) {
          var newOpp: Opportunity = {
            username: tempUsername,
            type: entry.type,
            name: entry.name,
            state: entry.state,
            city: entry.city,
            region: entry.region,
            income: entry.income,
            move: entry.move,
            principal: entry.principal,
            rate: entry.rate,
            annualCompounds: entry.annualCompounds,
            monthlyPayment: entry.monthlyPayment
          };
          tempOpps.push(newOpp);
        });
        this.opportunities = tempOpps;
        this.generateCharts(5); //generate the charts using the data that we've just collected
      }, (err) => {
        console.log(err);
      });
    }, (err) => {
      console.log(err);
    });
  }

  private generateCharts(numberOfYears: number) {
    if (this.debtProjection.hasOwnProperty('config')) {
      this.debtProjection.config.data.datasets = [];
      this.netIncome.config.data.datasets = [];
    }
    var labels = [];
    labels.push("0 Months");
    labels.push("1 Month");
    for (var i = 2; i <= numberOfYears*12; i = i+1) {
      labels.push(i+" Months");
    }
    this.generateDebtChart(labels);
    this.generateSavingsChart(labels);
  }

  private generateDebtChart(labels: string[]) {
    var debtProjectionPoints = [];
    var netPoints = [];
    var debtnames = [];
    var num = 0;
    var counter = 0;
    var title = "Debt Projected Over "+(labels.length - 1)+" Months";
    while (counter < this.debts.length) {
      var points = [];
      //var name = this.debts[counter].name;
      debtnames.push(this.debts[counter].name);
      var currentPrincipal = this.debts[counter].principal;
      var rate = this.debts[counter].rate/1200;
      while (num <= labels.length) {
        if (this.debts[counter].annualCompounds === 0) {
          //simple interest
          currentPrincipal = currentPrincipal*(1+rate);
          currentPrincipal = currentPrincipal - this.debts[counter].monthlyPayment;
        }
        else {
          currentPrincipal= this.debts[counter].principal*Math.pow(1+ (rate/ this.debts[counter].annualCompounds),this.debts[counter].annualCompounds*num);
        }
        if (currentPrincipal < 0) {
          break;
        }
        points.push(currentPrincipal);
        num=num+1;
      }
      debtProjectionPoints.push(points);
      counter=counter+1;
      num=0;
    }
    this.debtProjection = new Chart('canvas0', {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: debtnames[0],
          data: debtProjectionPoints[0],
          borderColor: this.colors[0],
          pointBackgroundColor: this.colors[0],
          pointBorderColor: this.colors[0],
          pointHoverBorderColor: this.colors[0],
          pointHoverBackgroundColor: this.colors[0],
          backgroundColor: 'transparent'
        }],
      },
      options: {
        title: {
          display: true,
          text: title,
        },
        tooltips:{
          position: 'nearest',
          mode: 'index',
          intersect: false,
          callbacks: {
            label: function(tooltipItem, data) {
              var valueTemp=+data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
              var value = Math.round(valueTemp * 100) / 100;
              var stringValue='';
              if(value >= 1000){
                stringValue= '$' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
              }
              else if(value <= -1000){
                stringValue= '$' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
              }
              else {
                stringValue = '$' + value;
              }
              var label = data.datasets[tooltipItem.datasetIndex].label || '';
              if (label) {
                label += ': ';
              }
              return label + stringValue;

            }
          }
        },
        legend: {
          display: true,
        },
        scales: {
          yAxes: [{
            scaleLabel:{
              display:true,
              labelString: 'Dollars',
            },
            ticks: {
              beginAtZero: true,
              callback: function(value, index, values) {
                if(parseInt(value) >= 1000){
                  return '$' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                }
                else if(parseInt(value) <= -1000){
                  return '$' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                }
                else {
                  return '$' + value;
                }
              }
            },
          }],
          xAxes: [{
            scaleLabel:{
              display:true,
              labelString: 'Years',
            }
          }]
        }
      }
    });
    var counter =1;
    while(counter<this.debts.length){
      var newSeries = {
        label: debtnames[counter],
        data: debtProjectionPoints[counter],
        borderColor: this.colors[counter],
        pointBackgroundColor: this.colors[counter],
        pointBorderColor: this.colors[counter],
        pointHoverBorderColor: this.colors[counter],
        pointHoverBackgroundColor: this.colors[counter],
        backgroundColor: 'transparent'

      };
      this.debtProjection.data['datasets'][counter]=newSeries;
      this.debtProjection.update();
      counter =counter+1;
    }
    if(this.debts.length>1){
      var num=0;
      while (num<=labels.length){
        var addedDebt=debtProjectionPoints[0][num];
        var counter=1;
        while (counter<this.debts.length){
          addedDebt=addedDebt+debtProjectionPoints[counter][num];
          counter=counter+1;
        }
        netPoints.push(addedDebt);
        num=num+1;
      }
      var newSeries2 = {
        label: "Total Debt",
        data: netPoints,
        borderColor: 'red',
        pointBackgroundColor:'red',
        pointBorderColor: 'red',
        pointHoverBorderColor: 'red',
        pointHoverBackgroundColor: 'red',
        backgroundColor: 'transparent'
      };
      this.debtProjection.data['datasets'][counter]=newSeries2;
      this.debtProjection.update();
    }
  }

  private generateSavingsChart(labels) {
    var title = "Savings Over "+(labels.length - 1)+" Months From Opportunities";
    var yearlyPaymentDebts=[];
    var netIncomePoints=[];
    var debtCounter=0;
    while(debtCounter<this.debts.length){
      var yearly = [];
      //    yearly.push(+this.debts[debtCounter].monthlyPayment*12);
      var num=0;
      var total= +this.debts[debtCounter].principal;
      while (num<=labels.length){
        total=total + (+this.debts[debtCounter].principal* +this.debts[debtCounter].rate/100) - (+this.debts[debtCounter].monthlyPayment*12);
        //  console.log(total);
        if (total>=0){
          yearly.push(+this.debts[debtCounter].monthlyPayment*12);
        }
        else {
          yearly.push(0);
        }
        num=num+1;
      }
      yearlyPaymentDebts.push(yearly);
      debtCounter=debtCounter+1;
    }
    var yearlyPaymentOpp=[];
    var oppCounter =0;
    while (oppCounter < this.opportunities.length){
      var paidOff=false;
      var yearly=[];
      var num=0;
      var total = +this.opportunities[oppCounter].principal;
      var rate = +this.opportunities[oppCounter].rate/100;
      while(num<=labels.length){
        if(+this.opportunities[oppCounter].annualCompounds==0){
          total=total + (+this.opportunities[oppCounter].principal* +this.opportunities[oppCounter].rate/100) - (+this.opportunities[oppCounter].monthlyPayment*12);
        }
        else {
          total= +this.opportunities[oppCounter].principal*Math.pow(1+(rate/ +this.opportunities[oppCounter].annualCompounds),+this.opportunities[oppCounter].annualCompounds*num) - (+this.opportunities[oppCounter].monthlyPayment*num*12);
        }
        if(paidOff==true){
          yearly.push(0);
        }
        else{
          if (total>=0){
            yearly.push(+this.opportunities[oppCounter].monthlyPayment*12);
          }
          else {
            yearly.push(0);
            paidOff=true;
          }
        }
        num=num+1;
      }
      yearlyPaymentOpp.push(yearly);
      oppCounter =oppCounter+1;
    }
    //console.log(yearlyPaymentOpp);
    var oppCounter=0;
    var netPoints=[];
    var oppNameList=[];
    while (oppCounter<this.opportunities.length){
      oppNameList.push(this.opportunities[oppCounter].name);
      var net=[];
      var num =0;
      var total= +this.opportunities[oppCounter].income;
      while(num<=labels.length){
        var debtLoop=0;
        while (debtLoop<yearlyPaymentDebts.length){
          total=total - +yearlyPaymentDebts[debtLoop][num];
          debtLoop=debtLoop+1;
        }
        total=total- +yearlyPaymentOpp[oppCounter][num];
        total=total- +this.profile.spending*12;
        //console.log(typeof this.opportunities[oppCounter].move);
        //console.log(this.opportunities[oppCounter].move.length);
        if(this.opportunities[oppCounter].move.length==2){
          total=total- +this.profile.rent*12;
        }
        net.push(total);
        total=total+ +this.opportunities[oppCounter].income;
        num=num+1;
      }
      netPoints.push(net);
      oppCounter=oppCounter+1;
    }
    //console.log(netPoints);
    this.netIncome = new Chart('canvas1', {
      animationEnabled: true,
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: oppNameList[0],
          data: netPoints[0],
          borderColor: this.colors[0],
          pointBackgroundColor: this.colors[0],
          pointBorderColor: this.colors[0],
          pointHoverBorderColor: this.colors[0],
          pointHoverBackgroundColor: this.colors[0],
          backgroundColor: 'transparent'
        }],
      },
      options: {
        title: {
          display: true,
          text:title,
        },
        legend: {
          display: true,
        },
        tooltips:{
          position: 'nearest',
          mode: 'index',
          intersect: false,
          callbacks: {
            label: function(tooltipItem, data) {
              var valueTemp=+data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
              var value = Math.round(valueTemp * 100) / 100;
              var stringValue='';
              if(value >= 1000){
                stringValue= '$' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
              }
              else if(value <= -1000){
                stringValue= '$' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
              }
              else {
                stringValue = '$' + value;
              }
              var label = data.datasets[tooltipItem.datasetIndex].label || '';
              if (label) {
                label += ': ';
              }
              return label + stringValue;

            }
          }
        },
        scales: {
          yAxes: [{
            scaleLabel:{
              display:true,
              labelString: 'Dollars',
            },
            ticks: {
              beginAtZero: true,
              callback: function(value, index, values) {
                if(parseInt(value) >= 1000){
                  return '$' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                }
                else if(parseInt(value) <= -1000){
                  return '$' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                }
                else {
                  return '$' + value;
                }
              }
            },
          }],
          xAxes: [{
            scaleLabel:{
              display:true,
              labelString: 'Years',
            }
          }]
        }
      }
    });

    var oppCounter=1;
    while(oppCounter<this.opportunities.length){
      var newSeries3 = {
        data: netPoints[oppCounter],
        label: oppNameList[oppCounter],
        borderColor: this.colors[oppCounter],
        pointBackgroundColor: this.colors[oppCounter],
        pointBorderColor: this.colors[oppCounter],
        pointHoverBorderColor: this.colors[oppCounter],
        pointHoverBackgroundColor: this.colors[oppCounter],
        backgroundColor: 'transparent'
      };
      this.netIncome.data['datasets'][oppCounter]=newSeries3;
      this.netIncome.update();
      oppCounter=oppCounter+1;
    }
  }

  private getOpportunityZillow(oppName: string, city: string, id: string) {
    this.resultService.getZillowData(id).subscribe((data) => {
      if (data['average'] > 0) {
        var result: ResultSet = {
          oppName: oppName,
          city: city,
          zillowData: this.auth.formatMoney(data['average'], true)
        };
        this.zillowResults.push(result);
      }
      this.dataSource.data = this.zillowResults;
    }, (err) => {
      var result: ResultSet = {
        oppName: oppName,
        city: city,
        zillowData: 'Zillow does not have estimate data for this city.'
      };
      this.zillowResults.push(result);
      this.dataSource.data = this.zillowResults;
    });
  }

  private displayZillowData() {
    this.oppService.getOpportunities(this.username).subscribe((data: Opportunity[]) => {
      var names = [];
      var cities = [];
      var ids = [];
      var counter = 0;
      data['opportunities'].forEach(function(item, index) {
        names.push(item.name);
        cities.push(item.city);
        ids.push(item._id);
        counter = counter + 1;
      });
      var i;
      for (i = 0; i < counter; i++) {
        this.getOpportunityZillow(names[i], cities[i], ids[i]);
      }
    });
  }

  private displayBLSData() {
    this.oppService.getOpportunities(this.username).subscribe((data: Opportunity[]) => {
      var regions = [];
      var names = [];
      data['opportunities'].forEach(function(item, index) {
        names.push(item.name);
        regions.push(item.region);
      });
      this.resultService.getBLSData(regions).subscribe((retVal: any[]) => {
        names = [];
        regions = [];
        var prices = [];
        var displayPrices = [];
        for (var i = 0; i < retVal.length; ++i) {
          var split = retVal[i].indexOf(':');
          prices.push(retVal[i].substring(split+2));
          regions.push(retVal[i].substring(0,split));
        }
        data['opportunities'].forEach(function(item, index) {
          regions.forEach(function(item2, index2) {
            if (item2.includes(item.region)) {
              names.push(item.city);
              displayPrices.push(prices[index2]);
            }
          });
        });
        // cost of living chart
        this.blsChart = new Chart('canvas2', {
          type: "bar",
          data: {
            labels: names,
            datasets: [{
              label: "1$ in the average American city is worth this much here",
              data: displayPrices,
              backgroundColor: this.colors,
              borderColor: this.colors,
            }]
          },
          options: {
            title: {
              display: true,
              text:"Purchasing Power Index",
            },
            legend:{
              display: false,
            },
            tooltips:{
              position: 'nearest',
              mode: 'index',
              intersect: false,
              callbacks: {
                label: function(tooltipItem, data) {
                  var valueTemp=+data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                  var value = Math.round(valueTemp * 100) / 100;
                  var stringValue='';
                  if(value >= 1000){
                    stringValue= '$' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                  }
                  else if(value <= -1000){
                    stringValue= '$' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                  }
                  else {
                    stringValue = '$' + value;
                  }
                  var label = "1$ in the average American city is worth "+stringValue+" here";
                  return label;
                }
              }
            },
            scales: {
              yAxes: [{
                scaleLabel:{
                  display:true,
                  labelString: 'Dollars',
                },
                ticks: {
                  beginAtZero: true,
                  callback: function(value, index, values) {
                    if(parseInt(value) >= 1000){
                      return '$' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    }
                    else if(parseInt(value) <= -1000){
                      return '$' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    }
                    else {
                      return '$' + value;
                    }
                  }
                }
              }]
            }
          }
        });
      }, (err) => {
        console.log(err);
      });
    });
  }

  public updateCharts() {
    var numberOfYears = +((document.getElementById("numYears") as HTMLInputElement).value);
    this.debtProjection.config.data.datasets=[];
    this.netIncome.config.data.datasets=[];
    this.generateCharts(numberOfYears);
  }

  public register() {
    this.newUsername = this.profileForm.value.username;
    this.newPassword = this.profileForm.value.password;
    if (this.newUsername === '' || this.newUsername.search(/dlcptwfcmc/i) > -1) { //the username uses our dummy sequence for temporary usernames
      this.alerts.open("Sorry, that username has already been taken. Please try another!");
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
          this.alerts.open("Registered!");
        }, (err) => {
          console.log(err);
        });
      }, (err) => {
        if (err.error.code === 11000) {
          this.alerts.open("Sorry, that username has already been taken. Please try another!");
        } else {
          console.log(err);
          this.router.navigateByUrl('/');
        }
      });
    }
  }

  ngOnInit() {
    this.auth.callUpdateColor("results");
    this.username = this.auth.getUsername();
    if (this.username === null) {
      this.alerts.open("Please fill out the Personal page before accessing this page.");
      this.router.navigateByUrl('/personal');
    } else {
      this.getData();
      this.displayBLSData();
      this.displayZillowData();
    }
  }

}
