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
    groceries: 0,
    rent: 0,
    spending: 0,
    savings: 0
  };
  debts: Debt[] = [];
  opportunities: Opportunity[] = [];
  opportunityBLS: number[] = [];
  opportunityIDs: string[] = [];
  homeBLS: number = 0;
  newUsername: string;
  newPassword: string;
  profileForm: FormGroup;
  chartForm: FormGroup;
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
    this.chartForm = this.builder.group({
      numMonths: [Validators.required]
    });
  }

  private getData(callGeneral: boolean) {
    this.profService.getProfile(this.username).subscribe((data: any) => { //returns the user's profile
      this.profile.username = this.username;
      this.profile.state = data.state;
      this.profile.region = data.region;
      this.profile.groceries = data.groceries;
      this.profile.rent = data.rent;
      this.profile.spending = data.spending;
      this.profile.savings = data.savings;
      this.resultService.getChartsData(this.username).subscribe((data: any) => { //returns the debts and opportunities for each user
        var tempUsername = this.username;
        var tempDebts: Debt[] = [];
        var tempOpps: Opportunity[] = [];
        var tempIDs: string[] = [];
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
          tempIDs.push(entry._id);
        });
        this.opportunities = tempOpps;
        this.opportunityIDs = tempIDs;
        this.displayBLSData(callGeneral);
        this.displayZillowData();
      }, (err) => {
        console.log(err);
      });
    }, (err) => {
      console.log(err);
    });
  }

  private displayBLSData(callGeneral: boolean) {
      var regions = [];
      var names = [];
      for (var i = 0; i < this.opportunities.length; ++i) {
        this.opportunityBLS.push(0); //initialize the array with the proper size
        regions.push(this.opportunities[i].region);
      }
      regions.push(this.profile.region);
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
        for (var i = 0; i < this.opportunities.length; ++i) {
          for (var j = 0; j < regions.length; ++j) {
            if (regions[j].includes(this.opportunities[i].region)) {
              this.opportunityBLS[i] = prices[j];
              names.push(this.opportunities[i].city);
              displayPrices.push(prices[j]);
              break;
            }
          }
        }
        for (var i = 0; i < regions.length; ++i) {
          if (regions[i].includes(this.profile.region)) {
            this.homeBLS = prices[i];
          }
        }
        //now I am ready to construct the graphs
        this.generateCharts(60, callGeneral); //generate the charts using a start value of 60 months
        //remove duplicates
        var tempNames = [];
        var tempPrices = [];
        names.forEach(function(item, index) {
          var notPresent = true;
          for (var i = 0; i < tempNames.length; ++i) {
            if (tempNames[i] === item) {
              notPresent = false;
              break;
            }
          }
          if (notPresent) {
            tempNames.push(item);
            tempPrices.push(displayPrices[index]);
          }
        });
        names = tempNames;
        displayPrices = tempPrices;
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
  }

  private generateCharts(numberOfMonths: number, callGeneral: boolean) {
    if (this.debtProjection.hasOwnProperty('config')) {
      this.debtProjection.config.data.datasets = [];
      this.netIncome.config.data.datasets = [];
    }
    var labels = [];
    labels.push("0 Months");
    labels.push("1 Month");
    for (var i = 2; i <= numberOfMonths; i = i + 1) {
      labels.push(i + " Months");
    }
    this.generateDebtChart(labels, callGeneral);
  }

  private generateDebtChart(labels: string[], callGeneral: boolean) {
    var debtProjectionPoints = [];
    var debtNames = [];
    var debtCount = 0;
    var title = "Projected Debt Over " + (labels.length - 1) + " Months";
    while (debtCount < this.debts.length) {
      var points = [];
      debtNames.push(this.debts[debtCount].name);
      var currentPrincipal = this.debts[debtCount].principal;
      var pointCount = 0;
      if (this.debts[debtCount].annualCompounds <= 0) { //simple interest
        var currentInterest = 0;
        var sum = currentInterest + currentPrincipal;
        var rateMultiplier = (this.debts[debtCount].rate / 1200);
        while (pointCount < labels.length) {
          if (sum < 0) {
            points.push(0);
            break;
          }
          points.push(sum);
          currentInterest = currentInterest + (currentPrincipal * rateMultiplier);
          if (currentInterest < this.debts[debtCount].monthlyPayment) {
            currentPrincipal = currentPrincipal - (this.debts[debtCount].monthlyPayment - currentInterest);
            currentInterest = 0;
          } else {
            currentInterest = currentInterest - this.debts[debtCount].monthlyPayment;
          }
          sum = currentPrincipal + currentInterest;
          pointCount = pointCount + 1;
        }
      } else { //compound interest
        var rateMultiplier = 1 + ((this.debts[debtCount].rate / 100) / this.debts[debtCount].annualCompounds);
        rateMultiplier = Math.pow(rateMultiplier,(this.debts[debtCount].annualCompounds / 12));
        while (pointCount < labels.length) {
          if (currentPrincipal < 0) {
            points.push(0);
            break;
          }
          points.push(currentPrincipal);
          currentPrincipal = currentPrincipal * rateMultiplier;
          currentPrincipal = currentPrincipal - this.debts[debtCount].monthlyPayment;
          pointCount = pointCount + 1;
        }
      }
      debtProjectionPoints.push(points);
      debtCount = debtCount + 1;
    }
    this.debtProjection = new Chart('canvas0', {
      type: 'line',
      data: {
        labels: labels,
        datasets: [],
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
          }]
        }
      }
    });
    debtCount = 0;
    while (debtCount < this.debts.length) {
      var newSeries = {
        label: debtNames[debtCount],
        data: debtProjectionPoints[debtCount],
        borderColor: this.colors[debtCount],
        pointBackgroundColor: this.colors[debtCount],
        pointBorderColor: this.colors[debtCount],
        pointHoverBorderColor: this.colors[debtCount],
        pointHoverBackgroundColor: this.colors[debtCount],
        backgroundColor: 'transparent'

      };
      this.debtProjection.data['datasets'][debtCount] = newSeries;
      debtCount = debtCount + 1;
    }
    this.debtProjection.update();
    if (this.debts.length > 1) { //create total debt
      var totalPoints = [];
      var pointCount = 0;
      while (pointCount < labels.length) {
        var addedDebt = 0;
        var newDebtCount = 0;
        while (newDebtCount < this.debts.length) {
          if (debtProjectionPoints[newDebtCount].length > pointCount) {
            addedDebt = addedDebt + debtProjectionPoints[newDebtCount][pointCount];
          }
          newDebtCount = newDebtCount + 1;
        }
        totalPoints.push(addedDebt);
        pointCount = pointCount + 1;
      }
      this.debtProjection.data['datasets'][debtCount] = {
        label: "Total Debt",
        data: totalPoints,
        borderColor: 'red',
        pointBackgroundColor:'red',
        pointBorderColor: 'red',
        pointHoverBorderColor: 'red',
        pointHoverBackgroundColor: 'red',
        backgroundColor: 'transparent'
      };
      this.debtProjection.update();
    }
    this.generateSavingsChart(labels, callGeneral);
  }

  private generateSavingsChart(labels: string[], callGeneral: boolean) {
    var title = "Projected Savings By Opportunity Over " + (labels.length - 1) + " Months";
    //how much does the user pay in debts each month
    var monthlyDebtPayments = [];
    var pointCount = 0;
    while (pointCount < labels.length - 1) {
      var debtCount = 0;
      var monthlyDebtPayment = 0;
      while (debtCount < this.debts.length) {
        var thisMonth = this.debtProjection.data['datasets'][debtCount].data[pointCount];
        var nextMonth = this.debtProjection.data['datasets'][debtCount].data[pointCount + 1];
        if (thisMonth && nextMonth) {
          monthlyDebtPayment = monthlyDebtPayment + (nextMonth - thisMonth);
        }
        debtCount = debtCount + 1;
      }
      monthlyDebtPayments.push(monthlyDebtPayment);
      pointCount = pointCount + 1;
    }
    //the last point in the graph has no next point, so we have to calculate its debt payment differently
    var debtCount = 0;
    var monthlyDebtPayment = 0;
    while (debtCount < this.debts.length) {
      var owedAmount = this.debtProjection.data['datasets'][debtCount].data[pointCount];
      if (owedAmount > this.debts[debtCount].monthlyPayment) {
        monthlyDebtPayment = monthlyDebtPayment + this.debts[debtCount].monthlyPayment;
      } else {
        monthlyDebtPayment = monthlyDebtPayment + owedAmount;
      }
      debtCount = debtCount + 1;
    }
    monthlyDebtPayments.push(monthlyDebtPayment);
    //how much would the user pay in loans for each opportunity
    var monthlyOppPayments = [];
    var oppCount = 0;
    while (oppCount < this.opportunities.length) {
      var points = [];
      var currentPrincipal = this.opportunities[oppCount].principal;
      var pointCount = 0;
      if (this.opportunities[oppCount].annualCompounds <= 0) { //simple interest
        var currentInterest = 0;
        var sum = currentInterest + currentPrincipal;
        var rateMultiplier = (this.opportunities[oppCount].rate / 1200);
        while (pointCount < labels.length) {
          if (sum < 0) {
            points.push(0);
          } else if (sum < this.opportunities[oppCount].monthlyPayment) {
            points.push(sum);
          } else {
            points.push(this.opportunities[oppCount].monthlyPayment);
          }
          currentInterest = currentInterest + (currentPrincipal * rateMultiplier);
          if (currentInterest < this.opportunities[oppCount].monthlyPayment) {
            currentPrincipal = currentPrincipal - (this.opportunities[oppCount].monthlyPayment - currentInterest);
            currentInterest = 0;
          } else {
            currentInterest = currentInterest - this.opportunities[oppCount].monthlyPayment;
          }
          sum = currentPrincipal + currentInterest;
          pointCount = pointCount + 1;
        }
      } else { //compound interest
        var rateMultiplier = 1 + ((this.opportunities[oppCount].rate / 100) / this.opportunities[oppCount].annualCompounds);
        rateMultiplier = Math.pow(rateMultiplier,(this.opportunities[oppCount].annualCompounds / 12));
        while (pointCount < labels.length) {
          if (currentPrincipal < 0) {
            points.push(0);
          } else if (currentPrincipal < this.opportunities[oppCount].monthlyPayment) {
            points.push(currentPrincipal);
          } else {
            points.push(this.opportunities[oppCount].monthlyPayment);
          }
          currentPrincipal = currentPrincipal * rateMultiplier;
          currentPrincipal = currentPrincipal - this.opportunities[oppCount].monthlyPayment;
          pointCount = pointCount + 1;
        }
      }
      monthlyOppPayments.push(points);
      oppCount = oppCount + 1;
    }
    //how much would groceries, rent, and spending cost in each opportunity
    var oppProjectionPoints = [];
    var oppNames = [];
    oppCount = 0;
    while (oppCount < this.opportunities.length) {
      oppNames.push(this.opportunities[oppCount].name);
      var savingsByMonth = [];
      var currentSavings = this.profile.savings;
      pointCount = 0;
      while (pointCount < labels.length) {
        savingsByMonth.push(currentSavings);
        currentSavings = currentSavings + (this.opportunities[oppCount].income / 12);
        currentSavings = currentSavings - (monthlyOppPayments[oppCount][pointCount]);
        currentSavings = currentSavings - (monthlyDebtPayments[pointCount]);
        if (pointCount === 0 && this.opportunities[oppCount].move === "Yes") { //relocation costs about 4 times the rent of the apartment being moved
          currentSavings = currentSavings - 4*this.profile.rent;
        }
        var baseSpending = this.profile.rent+this.profile.groceries+this.profile.spending;
        currentSavings = currentSavings - (baseSpending * (this.opportunityBLS[oppCount] / this.homeBLS)); //adjust for Cost of Living
        pointCount = pointCount + 1;
      }
      oppProjectionPoints.push(savingsByMonth);
      oppCount = oppCount + 1;
    }
    this.netIncome = new Chart('canvas1', {
      animationEnabled: true,
      type: 'line',
      data: {
        labels: labels,
        datasets: [],
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
          }]
        }
      }
    });
    oppCount = 0;
    while (oppCount < this.opportunities.length) {
      var newSeries = {
        data: oppProjectionPoints[oppCount],
        label: oppNames[oppCount],
        borderColor: this.colors[oppCount],
        pointBackgroundColor: this.colors[oppCount],
        pointBorderColor: this.colors[oppCount],
        pointHoverBorderColor: this.colors[oppCount],
        pointHoverBackgroundColor: this.colors[oppCount],
        backgroundColor: 'transparent'
      };
      this.netIncome.data['datasets'][oppCount] = newSeries;
      oppCount = oppCount + 1;
    }
    this.netIncome.update();
    if (callGeneral) {
      this.generateOverallChart();
    }
  }

  private generateOverallChart() {
    var oppMinSavings = [];
    for (var i = 0; i < this.opportunities.length; ++i) {
      var minSavings = 1000000000;
      for (var j = 0; j < this.netIncome.data['datasets'][i].data.length; ++j) {
        if (minSavings > this.netIncome.data['datasets'][i].data[j]) {
          minSavings = this.netIncome.data['datasets'][i].data[j];
        }
      }
      oppMinSavings.push(minSavings);
    }
    var sortedOpps = [];
    for (var i = 0; i < oppMinSavings.length; ++i) {
      var maxSavings = -1000000000;
      var savedIndex = -1;
      for (var j = 0; j < oppMinSavings.length; ++j) {
        if (maxSavings < oppMinSavings[j]) {
          var jInSortedOpps = false;
          for (var k = 0; k < sortedOpps.length; ++k) {
            if (sortedOpps[k] === j) {
              jInSortedOpps = true;
              break;
            }
          }
          if (!jInSortedOpps) {
            maxSavings = oppMinSavings[j];
            savedIndex = j;
          }
        }
      }
      sortedOpps.push(savedIndex);
    }
    /*
      Sorted opps now contains a mapping of the sorted opportunities from best to worst
      That is, this.opportunities[sortedOpps[0]] is the opportunity that puts the least stress on the user's savings
      this.opportunities[sortedOpps[1]] is the second easiest, and so on
    */
    //TODO create the graph
  }

  private displayZillowData() {
      var names = [];
      var cities = [];
      this.opportunities.forEach(function(item, index) {
        names.push(item.name);
        cities.push(item.city);
      });
      for (var i = 0; i < this.opportunities.length; i++) {
        this.getOpportunityZillow(names[i], cities[i], this.opportunityIDs[i]);
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

  public updateCharts() {
    this.generateCharts(this.chartForm.value.numMonths, false);
    this.chartForm.reset();
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
    this.chartForm.reset();
    this.auth.callUpdateColor("results");
    this.username = this.auth.getUsername();
    if (this.username === null) {
      this.alerts.open("Please fill out the Personal page before accessing this page.");
      this.router.navigateByUrl('/personal');
    } else {
      this.getData(true);
    }
  }

}
