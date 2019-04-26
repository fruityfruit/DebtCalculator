import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { Chart } from "chart.js";
import { AuthenticationService, PasswordPayload, UsernamePayload} from "../authentication.service";
import { Opportunity } from "../opportunity.service";
import { ResultService, ZillowSet, SavingsSet } from "../result.service";
import { ProfileService, Profile, Debt } from "../profile.service";
import { Router } from "@angular/router";
import { MatTableDataSource } from "@angular/material";
import { SnackbarService } from "../snackbar.service";

@Component({
  selector: "app-results",
  templateUrl: "./results.component.html",
  styleUrls: ["./results.component.css"]
})

export class ResultsComponent implements OnInit {
  username: string = "";
  zillowResults: ZillowSet[] = [];
  rankings: SavingsSet[] = [];
  blsChart = [] as Chart;
  debtProjection = [] as Chart;
  savingsProjection = [] as Chart;
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
  registerForm: FormGroup;
  chartForm: FormGroup;
  zillowSource = new MatTableDataSource(this.zillowResults);
  rankingSource = new MatTableDataSource(this.rankings);
  displayedColumns: string[] = ["name", "city", "estimate"];
  displayedColumnsOpp: string[] = ["name", "city", "income", "savings1", "savings2"];
  colors = ["darkgreen", "aqua", "indigo", "maroon", "skyblue", "magenta", "pink", "gold", "salmon", "mediumseagreen"];

  constructor(public auth: AuthenticationService, private resultService: ResultService,
              private profService: ProfileService, private builder: FormBuilder,
              private router: Router, private alerts: SnackbarService) {
    this.registerForm = this.builder.group({
      username: ["", Validators.required],
      password: ["", Validators.required]
    });
    this.chartForm = this.builder.group({
      numberOfMonths: [Validators.required]
    });
  }

  /*
    This function is called by ngOnInit.
    This function gets the data that the rest of the file needs to generate the charts present on this page.
    First, it calls getProfile in the profile service to get the user's profile.
    If the profile is not filled out fully, it alerts the user and redirects them to the profile page.
    Then, it calls getChartsData in the result service to get the debts and opportunities that the user has.
    It parses through each debt and opportunity to save them as instance variables.
    If there are no opportunities or no global debts, it closes those graphs respectively.
    Lastly, it calls the next two functions: displayBLSData and displayZillowData.
    If there are any errors, the function logs them.
  */
  private getData(calledOnInit: boolean) {
    this.profService.getProfile(this.username).subscribe((data: any) => { //returns the user's profile
      this.profile.username = this.username;
      this.profile.state = data.state;
      this.profile.region = data.region;
      this.profile.groceries = data.groceries;
      this.profile.rent = data.rent;
      this.profile.spending = data.spending;
      this.profile.savings = data.savings;
      if (!(this.profile.username && this.profile.state && this.profile.region && (this.profile.groceries >= 0)
          && (this.profile.rent >= 0) && (this.profile.spending >= 0) && (this.profile.savings >= 0))) {
        this.alerts.open("Please fill out the Profile page before accessing this page.");
        window.localStorage.setItem("profile-snackbar", "true");
        this.router.navigateByUrl("/profile");
      } else {
        this.resultService.getChartsData(this.username).subscribe((data: any) => { //returns the user's debts and opportunities
          var tempUsername = this.username;
          var tempDebts: Debt[] = [];
          var tempOpps: Opportunity[] = [];
          var tempIDs: string[] = [];
          var debtsForAllOpps = 0;
          data.debts.forEach(function(entry) { //saves each debt as an instance variable
            var newDebt: Debt = {
              username: tempUsername,
              name: entry.name,
              principal: entry.principal,
              rate: entry.rate,
              annualCompounds: entry.annualCompounds,
              monthlyPayment: entry.monthlyPayment,
              opportunity: entry.opportunity
            };
            if (newDebt.opportunity === "all") { //if the debt is for all opportunities, count it
              debtsForAllOpps = debtsForAllOpps + 1;
            }
            tempDebts.push(newDebt);
          });
          this.debts = tempDebts;
          if (debtsForAllOpps === 0) { //if there are no debts that should be in the debt chart
            document.getElementById("debtCanvas").style.height = "0";
          }
          data.opportunities.forEach(function(entry) { //saves each opportunity as an instance variable
            var newOpp: Opportunity = {
              username: tempUsername,
              type: entry.type,
              name: entry.name,
              state: entry.state,
              city: entry.city,
              region: entry.region,
              income: entry.income,
              bonus: entry.bonus,
              move: entry.move
            };
            tempOpps.push(newOpp);
            tempIDs.push(entry._id);
          });
          this.opportunities = tempOpps;
          if (this.opportunities.length === 0) { //if there are no opportunities
            document.getElementById("savingsCanvas").style.height = "0";
          }
          this.opportunityIDs = tempIDs;
          this.displayBLSData(calledOnInit);
          this.displayZillowData();
        }, (err) => {
          console.log(err);
        });
      }
    }, (err) => {
      console.log(err);
    });
  }

  /*
    This function is called by getData.
    This function gets and then displays the cost of living data from the BLS API in a chart.
    It first calls getBLSData from the result service with an array of regions.
    It then saves that data into two arrays: one containing the name of each city, and another containing each city's BLS value.
    It then calls the generateCharts function, which depends on this BLS data.
    It then removes duplicates from these two arrays. Finally, it generates the actual chart.
  */
  private displayBLSData(calledOnInit: boolean) {
    var regions = [];
    for (var i = 0; i < this.opportunities.length; ++i) { //populates regions with the region of each opportunity
      this.opportunityBLS.push(0); //initialize the array with the proper size
      regions.push(this.opportunities[i].region);
    }
    regions.push(this.profile.region); //the user's current region
    this.resultService.getBLSData(regions).subscribe((data: any[]) => { //gets the cost of living data for the regions
      regions = [];
      var cityNames = [];
      var prices = [];
      var displayPrices = [];
      for (var i = 0; i < data.length; ++i) { //for each region with cost of living data
        var colonIndex = data[i].indexOf(":");
        prices.push(data[i].substring(colonIndex+2)); //the cost of living index for the region
        regions.push(data[i].substring(0,colonIndex)); //the region code
      }
      for (var i = 0; i < this.opportunities.length; ++i) {
        for (var j = 0; j < regions.length; ++j) {
          if (regions[j].includes(this.opportunities[i].region)) { //for each opp, the first time it finds its matching region, save it and stop looking
            this.opportunityBLS[i] = prices[j];
            cityNames.push(this.opportunities[i].city);
            displayPrices.push(prices[j]);
            break;
          }
        }
      }
      for (var i = 0; i < regions.length; ++i) { //searches for and saves the cost of living index of the user's current home
        if (regions[i].includes(this.profile.region)) {
          this.homeBLS = prices[i];
        }
      }
      this.generateCharts(60, calledOnInit); //generate the charts using a default value of 60 months
      //opportunities in the same city have been saved twice, so duplicates must be removed
      var tempNames = [];
      var tempPrices = [];
      cityNames.forEach(function(item, index) { //for each city, if it is not already in tempNames, copy it into it
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
      cityNames = tempNames; //reassign cityNames to its de-duped version
      displayPrices = tempPrices; //reassign displayPrices to its de-duped version
      if (cityNames.length === 0 || displayPrices.length === 0) { //if there is nothing to display, collapse the graph
        document.getElementById("blsCanvas").style.height = "0";
      }
      this.blsChart = new Chart("blsCanvas", { //generate the cost-of-living chart
        type: "bar",
        data: { //fills the chart with the displayPrices data
          labels: cityNames,
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
          legend: {
            display: false,
          },
          tooltips: { //sets the tooltips to a descriptive explanation
            position: "nearest",
            mode: "index",
            intersect: false,
            callbacks: {
              label: function(tooltipItem, data) { //converts the data to an easily readable money string
                var valueTemp = +data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                var value = Math.round(valueTemp * 100) / 100;
                var stringValue = "";
                if (value >= 1000) {
                  stringValue = "$" + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                } else if (value <= -1000) {
                  stringValue = "$" + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                } else {
                  stringValue = "$" + value;
                }
                var label = "1$ in the average American city is worth " + stringValue + " here";
                return label;
              }
            }
          },
          scales: {
            yAxes: [{ //labels the y-axis
              ticks: {
                beginAtZero: true,
                callback: function(value, index, values) { //converts the data to an easily readable money string
                  if (parseInt(value) >= 1000) {
                    return "$" + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                  } else if (parseInt(value) <= -1000) {
                    return "$" + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                  } else {
                    return "$" + value;
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

  /*
    This function is called by updateCharts and displayBLSData.
    First, this function clears the data from the debt and savings charts.
    Then, it creates the labels that the debt and savings charts will use.
    Finally, it calls generateDebtChart.
  */
  private generateCharts(numberOfMonths: number, calledOnInit: boolean) {
    if (this.debtProjection.hasOwnProperty("config")) {
      this.debtProjection.config.data.datasets = [];
    }
    if (this.savingsProjection.hasOwnProperty("config")) {
      this.savingsProjection.config.data.datasets = [];
    }
    var labels = [];
    labels.push("0 Months");
    labels.push("1 Month");
    for (var i = 2; i <= numberOfMonths; i = i + 1) {
      labels.push(i + " Months");
    }
    this.generateDebtChart(labels, calledOnInit);
  }

  /*
    This function is called by generateCharts.
    For each debt that is valid for all of the user's opportunity, it creates an array of the balance of that
    debt at each month. A different method is used for simple and compound interest.
    After these arrays are created, an empty debt chart is created.
    Then, each array is added as a differently-colored line to the chart.
    If there are multiple debt lines, one more line, representing the total debt, is added.
  */
  private generateDebtChart(labels: string[], calledOnInit: boolean) {
    var debtProjectionPoints = [];
    var debtNames = [];
    var debtCount = 0;
    var title = "Projected Debt Over " + (labels.length - 1) + " Months";
    while (debtCount < this.debts.length) { //for each debt
      if (this.debts[debtCount].opportunity === "all") { //only include the debt in this graph if it is applicable to all opportunities
        var points = [];
        debtNames.push(this.debts[debtCount].name); //add the name of this debt to the array with the selected debt names
        var currentPrincipal = this.debts[debtCount].principal;
        var pointCount = 0;
        if (this.debts[debtCount].annualCompounds <= 0) { //simple interest
          var currentInterest = 0;
          var sum = currentInterest + currentPrincipal;
          var rateMultiplier = (this.debts[debtCount].rate / 1200); //the number by which to multiply the principal to calculate monthly interest
          while (pointCount < labels.length) { //for each month over which the graph is projected
            if (sum < 0) {
              points.push(0);
              break;
            }
            points.push(sum);
            currentInterest = currentInterest + (currentPrincipal * rateMultiplier); //update the amount of interest owed
            if (currentInterest < this.debts[debtCount].monthlyPayment) { //if the monthly payment covers interest and some principal
              currentPrincipal = currentPrincipal - (this.debts[debtCount].monthlyPayment - currentInterest);
              currentInterest = 0;
            } else { //if the monthly payment only covers part of the interest owed
              currentInterest = currentInterest - this.debts[debtCount].monthlyPayment;
            }
            sum = currentPrincipal + currentInterest;
            pointCount = pointCount + 1;
          }
        } else { //compound interest
          var rateMultiplier = 1 + (this.debts[debtCount].rate / (100 * this.debts[debtCount].annualCompounds));
          rateMultiplier = Math.pow(rateMultiplier, (this.debts[debtCount].annualCompounds / 12));
          while (pointCount < labels.length) { //for each month over which the graph is projected
            if (currentPrincipal < 0) {
              points.push(0);
              break;
            }
            points.push(currentPrincipal);
            currentPrincipal = currentPrincipal * rateMultiplier;  //charge interest on the principal
            currentPrincipal = currentPrincipal - this.debts[debtCount].monthlyPayment; //subtract the monthly payment
            pointCount = pointCount + 1;
          }
        }
        debtProjectionPoints.push(points); //save the debt's projection points in the array
      }
      debtCount = debtCount + 1;
    }
    this.debtProjection = new Chart("debtCanvas", { //generate the debt chart
      type: "line",
      data: {
        labels: labels,
        datasets: [],
      },
      options: {
        title: {
          display: true,
          text: title,
        },
        tooltips: { //sets the tooltips to a descriptive explanation
          position: "nearest",
          mode: "index",
          intersect: false,
          callbacks: {
            label: function(tooltipItem, data) { //converts the data to an easily readable money string
              var valueTemp = +data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
              var value = Math.round(valueTemp * 100) / 100;
              var stringValue = "";
              if (value >= 1000) {
                stringValue = "$" + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
              } else if (value <= -1000) {
                stringValue = "$" + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
              } else {
                stringValue = "$" + value;
              }
              var label = data.datasets[tooltipItem.datasetIndex].label || "";
              if (label) {
                label += ": ";
              }
              return label + stringValue;
            }
          }
        },
        legend: {
          display: true,
        },
        scales: {
          yAxes: [{ //labels the y-axis
            ticks: {
              beginAtZero: true,
              callback: function(value, index, values) { //converts the data to an easily readable money string
                if (parseInt(value) >= 1000) {
                  return "$" + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                } else if (parseInt(value) <= -1000) {
                  return "$" + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                } else {
                  return "$" + value;
                }
              }
            },
          }]
        }
      }
    });
    debtCount = 0;
    while (debtCount < debtNames.length) { //adds a new series of points for each debt that goes in the debt graph
      var newSeries = {
        label: debtNames[debtCount],
        data: debtProjectionPoints[debtCount],
        borderColor: this.colors[debtCount],
        pointBackgroundColor: this.colors[debtCount],
        pointBorderColor: this.colors[debtCount],
        pointHoverBorderColor: this.colors[debtCount],
        pointHoverBackgroundColor: this.colors[debtCount],
        backgroundColor: "transparent"
      };
      this.debtProjection.data["datasets"][debtCount] = newSeries;
      debtCount = debtCount + 1;
    }
    this.debtProjection.update(); //updates the graph now that it is populated with data
    if (debtNames.length > 1) { //creates the total debt series
      var totalPoints = [];
      var pointCount = 0;
      while (pointCount < labels.length) { //for each month being calculated
        var addedDebt = 0;
        var newDebtCount = 0;
        while (newDebtCount < debtProjectionPoints.length) { //for each debt in the graph
          if (debtProjectionPoints[newDebtCount].length > pointCount) { //if the debt has not yet been paid off by this month, add it to the total debt line
            addedDebt = addedDebt + debtProjectionPoints[newDebtCount][pointCount];
          }
          newDebtCount = newDebtCount + 1;
        }
        totalPoints.push(addedDebt);
        pointCount = pointCount + 1;
      }
      this.debtProjection.data["datasets"][debtCount] = { //adds a new series of points for the total debt line
        label: "Total Debt",
        data: totalPoints,
        borderColor: "red",
        pointBackgroundColor:"red",
        pointBorderColor: "red",
        pointHoverBorderColor: "red",
        pointHoverBackgroundColor: "red",
        backgroundColor: "transparent"
      };
      this.debtProjection.update(); //updates the graph now that it is populated with more data
    }
    this.generateSavingsChart(labels, calledOnInit);
  }

  /*
    This function is called by generateDebtChart.
    First, it creates an array of the monthly payments that a user spends on debts for all opportunities.
    Then, it creates an array of the monthly payments that a user spends on debts for each specific opportunity.
    Then, it combines these two arrays with the user's profile information to create an array of each opportunity's potential savings.
    After these arrays are created, an empty opportunity chart is created.
    Then, each opportunity's savings array is added as a differently-colored line to the chart.
  */
  private generateSavingsChart(labels: string[], calledOnInit: boolean) {
    var title = "Projected Savings By Opportunity Over " + (labels.length - 1) + " Months";
    //first we calculate how much the user will pay each month in the debts valid for all opportunities
    var monthlyDebtPayments = [];
    var pointCount = 0;
    while (pointCount < labels.length - 1) { //for each month over which we are projecting
      var debtCount = 0;
      var monthlyDebtPayment = 0;
      if (this.debtProjection.data["datasets"].length > 1) { //total debts is included, so we must exclude it
        while (debtCount < this.debtProjection.data["datasets"].length - 1) {
          var thisMonth = this.debtProjection.data["datasets"][debtCount].data[pointCount];
          var nextMonth = this.debtProjection.data["datasets"][debtCount].data[pointCount + 1];
          if (thisMonth && nextMonth) { //the monthly payment is the difference in balances
            monthlyDebtPayment = monthlyDebtPayment + (thisMonth - nextMonth);
          }
          debtCount = debtCount + 1;
        }
      } else if (this.debtProjection.data["datasets"].length === 1) { //only one debt is present, so only have to do the process once
        var thisMonth = this.debtProjection.data["datasets"][debtCount].data[pointCount];
        var nextMonth = this.debtProjection.data["datasets"][debtCount].data[pointCount + 1];
        if (thisMonth && nextMonth) { //the monthly payment is the difference in balances
          monthlyDebtPayment = monthlyDebtPayment + (thisMonth - nextMonth);
        }
      }
      monthlyDebtPayments.push(monthlyDebtPayment); //add the month's combined debt obligations to the array
      pointCount = pointCount + 1;
    }
    //the last point in the graph has no next point, so we have to calculate its debt payment differently
    var debtCount = 0;
    var includedDebtCount = 0;
    var monthlyDebtPayment = 0;
    while (debtCount < this.debts.length) {
      if (this.debts[debtCount].opportunity === "all") { //for each debt for all opportunities
        var owedAmount = this.debtProjection.data["datasets"][includedDebtCount].data[pointCount];
        if (owedAmount && owedAmount > this.debts[debtCount].monthlyPayment) { //add the debt's monthly payment
          monthlyDebtPayment = monthlyDebtPayment + this.debts[debtCount].monthlyPayment;
        } else if (owedAmount) { //add the debt's owed amount, which is less than the monthly payment
          monthlyDebtPayment = monthlyDebtPayment + owedAmount;
        }
        includedDebtCount = includedDebtCount + 1;
      }
      debtCount = debtCount + 1;
    }
    monthlyDebtPayments.push(monthlyDebtPayment);
    //next we calculate how much the user would pay in loans for each individual opportunity
    var monthlyOppPayments = [];
    var oppCount = 0;
    while (oppCount < this.opportunities.length) { //for each opportunity
      var points = [];
      debtCount = 0;
      while (debtCount < this.debts.length) {
        if (this.debts[debtCount].opportunity === this.opportunityIDs[oppCount]) { //for each debt that is associated with this opportunity
          var pointsForThisDebt = [];
          var currentPrincipal = this.debts[debtCount].principal;
          var pointCount = 0;
          if (this.debts[debtCount].annualCompounds <= 0) { //simple interest
            var currentInterest = 0;
            var sum = currentInterest + currentPrincipal;
            var rateMultiplier = (this.debts[debtCount].rate / 1200); //the number by which to multiply the principal to calculate monthly interest
            while (pointCount < labels.length) { //for each month over which the graph is projected
              if (sum < 0) {
                pointsForThisDebt.push(0);
              } else if (sum < this.debts[debtCount].monthlyPayment) {
                pointsForThisDebt.push(sum);
              } else {
                pointsForThisDebt.push(this.debts[debtCount].monthlyPayment);
              }
              currentInterest = currentInterest + (currentPrincipal * rateMultiplier); //update the amount of interest owed
              if (currentInterest < this.debts[debtCount].monthlyPayment) { //if the monthly payment covers interest and some principal
                currentPrincipal = currentPrincipal - (this.debts[debtCount].monthlyPayment - currentInterest);
                currentInterest = 0;
              } else { //if the monthly payment only covers part of the interest owed
                currentInterest = currentInterest - this.debts[debtCount].monthlyPayment;
              }
              sum = currentPrincipal + currentInterest;
              pointCount = pointCount + 1;
            }
          } else { //compound interest
            var rateMultiplier = 1 + ((this.debts[debtCount].rate / 100) / this.debts[debtCount].annualCompounds);
            rateMultiplier = Math.pow(rateMultiplier,(this.debts[debtCount].annualCompounds / 12));
            while (pointCount < labels.length) { //for each month over which the graph is projected
              if (currentPrincipal < 0) {
                pointsForThisDebt.push(0);
              } else if (currentPrincipal < this.debts[debtCount].monthlyPayment) {
                pointsForThisDebt.push(currentPrincipal);
              } else {
                pointsForThisDebt.push(this.debts[debtCount].monthlyPayment);
              }
              currentPrincipal = currentPrincipal * rateMultiplier; //charge interest on the principal
              currentPrincipal = currentPrincipal - this.debts[debtCount].monthlyPayment; //subtract the monthly payment
              pointCount = pointCount + 1;
            }
          }
          points.push(pointsForThisDebt); //save the debt's projection points in the array
        }
        debtCount = debtCount + 1;
      }
      var combinedPoints = []; //condense the multiple arrays for multiple debts into one array
      for (var i = 0; i < labels.length; ++i) { //for each month over which we are projecting
        var totalOppDebt = 0;
        for (var j = 0; j < points.length; ++j) { //for each related debt
          if (points[j][i] > 0) {
            totalOppDebt = totalOppDebt + points[j][i];
          }
        }
        combinedPoints.push(totalOppDebt);
      }
      monthlyOppPayments.push(combinedPoints);
      oppCount = oppCount + 1;
    }
    //combine the first two arrays with the user's spending habit to make the savings projection
    var oppProjectionPoints = [];
    var oppNames = [];
    oppCount = 0;
    while (oppCount < this.opportunities.length) { //for each opportunity
      oppNames.push(this.opportunities[oppCount].name);
      var savingsByMonth = [];
      var currentSavings = this.profile.savings;
      pointCount = 0;
      var baseSpending = this.profile.rent + this.profile.groceries + this.profile.spending;
      baseSpending = baseSpending * (this.opportunityBLS[oppCount] / this.homeBLS); //adjust for Cost of Living
      while (pointCount < labels.length) { //for each month over which we are projecting
        savingsByMonth.push(currentSavings);
        currentSavings = currentSavings + (this.opportunities[oppCount].income / 12); //add income
        currentSavings = currentSavings - (monthlyOppPayments[oppCount][pointCount]); //subtract opportunity-specific debts
        currentSavings = currentSavings - (monthlyDebtPayments[pointCount]); //subtract opportunity-agnostic debts
        currentSavings = currentSavings - baseSpending; //subtract monthly spending
        if (pointCount === 0) { //in the first month, bonus and moving costs should be factored in
          currentSavings = currentSavings + this.opportunities[oppCount].bonus;
          if (this.opportunities[oppCount].move === "Yes") { //relocation costs about 4 times the rent of the apartment being moved
            currentSavings = currentSavings - 4 * this.profile.rent;
          }
        }
        pointCount = pointCount + 1;
      }
      oppProjectionPoints.push(savingsByMonth);
      oppCount = oppCount + 1;
    }
    this.savingsProjection = new Chart("savingsCanvas", { //generate the savings chart
      animationEnabled: true,
      type: "line",
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
        tooltips: { //sets the tooltips to a descriptive explanation
          position: "nearest",
          mode: "index",
          intersect: false,
          callbacks: {
            label: function(tooltipItem, data) { //converts the data to an easily readable money string
              var valueTemp = +data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
              var value = Math.round(valueTemp * 100) / 100;
              var stringValue = "";
              if (value >= 1000) {
                stringValue = "$" + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
              } else if (value <= -1000) {
                stringValue = "$" + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
              } else {
                stringValue = "$" + value;
              }
              var label = data.datasets[tooltipItem.datasetIndex].label || "";
              if (label) {
                label += ": ";
              }
              return label + stringValue;
            }
          }
        },
        scales: {
          yAxes: [{ //labels the y-axis
            ticks: {
              beginAtZero: true,
              callback: function(value, index, values) { //converts the data to an easily readable money string
                if (parseInt(value) >= 1000) {
                  return "$" + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                } else if (parseInt(value) <= -1000) {
                  return "$" + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                } else {
                  return "$" + value;
                }
              }
            },
          }]
        }
      }
    });
    oppCount = 0;
    while (oppCount < this.opportunities.length) { //adds a new series of points for each opportunity that goes in the opportunity graph
      var newSeries = {
        data: oppProjectionPoints[oppCount],
        label: oppNames[oppCount],
        borderColor: this.colors[oppCount],
        pointBackgroundColor: this.colors[oppCount],
        pointBorderColor: this.colors[oppCount],
        pointHoverBorderColor: this.colors[oppCount],
        pointHoverBackgroundColor: this.colors[oppCount],
        backgroundColor: "transparent"
      };
      this.savingsProjection.data["datasets"][oppCount] = newSeries;
      oppCount = oppCount + 1;
    }
    this.savingsProjection.update(); //updates the graph now that it is populated with data
    if (calledOnInit) {
      this.generateOverallChart();
    }
  }

  /*
    This function is called by generateSavingsChart.
    First, it finds the minimum and maximum monthly savings for each opportunity.
    Then, it sorts the opportunities by highest minimum savings amount.
    Then, it breaks ties by highest maximum savings amount.
    Finally, it adds the sorted opportunities to the ranking table.
  */
  private generateOverallChart() {
    var oppMinSavings = [];
    var oppMaxSavings = [];
    for (var i = 0; i < this.opportunities.length; ++i) { //finds the minimum and maximum savings amount for each opportunity
      var minSavings = 1000000000;
      var maxSavings = -1000000000;
      for (var j = 0; j < this.savingsProjection.data["datasets"][i].data.length; ++j) {
        if (minSavings > this.savingsProjection.data["datasets"][i].data[j]) {
          minSavings = this.savingsProjection.data["datasets"][i].data[j];
        }
        if (maxSavings < this.savingsProjection.data["datasets"][i].data[j]) {
          maxSavings = this.savingsProjection.data["datasets"][i].data[j];
        }
      }
      oppMinSavings.push(minSavings);
      oppMaxSavings.push(maxSavings);
    }
    var sortedOpps = [];
    for (var i = 0; i < oppMinSavings.length; ++i) { //for each opportunity, find the most affordable option
      var maxSavings = -1000000000;
      var savedIndex = -1;
      for (var j = 0; j < oppMinSavings.length; ++j) {
        if (maxSavings < oppMinSavings[j]) { //if the opportunity is the best option we have seen and has not already been added to the sorted list
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
    var stopSwapping = false;
    while (!stopSwapping) { //break ties between opportunities based on most lucrative
      stopSwapping = true;
      for (var i = 0; i < sortedOpps.length - 1; ++i) { //elevate an opportunity's position by one if it is as affordable and more lucrative than its neighbor
        if ((oppMinSavings[sortedOpps[i]] === oppMinSavings[sortedOpps[i+1]]) && (oppMaxSavings[sortedOpps[i]] < oppMaxSavings[sortedOpps[i+1]])) {
          var temp = sortedOpps[i];
          sortedOpps[i] = sortedOpps[i+1];
          sortedOpps[i+1] = temp;
          stopSwapping = false;
        }
      }
    }
    for (var i = 0; i < sortedOpps.length; ++i) { //for each opportunity
      var yearOne = this.savingsProjection.data["datasets"][sortedOpps[i]].data[12];
      var yearThree = this.savingsProjection.data["datasets"][sortedOpps[i]].data[36];
      var income = this.opportunities[sortedOpps[i]].income;
      var oppResult: SavingsSet = { //add the opportunity to the table
        oppName: this.opportunities[sortedOpps[i]].name,
        city: this.opportunities[sortedOpps[i]].city,
        income: this.auth.formatMoney(income, true),
        savings1: this.auth.formatMoney(yearOne, true),
        savings2: this.auth.formatMoney(yearThree, true)
      };
      this.rankings.push(oppResult);
    }
    this.rankingSource.data = this.rankings; //update the ranking table
  }

  /*
    This function is called by getData.
    It simply calls getOpportunityZillow for each opportunity.
  */
  private displayZillowData() {
      var names = [];
      var cities = [];
      this.opportunities.forEach(function(item, index) { //add the name and city of each opportunity to the array
        names.push(item.name);
        cities.push(item.city);
      });
      for (var i = 0; i < this.opportunities.length; ++i) {
        this.getOpportunityZillow(names[i], cities[i], this.opportunityIDs[i]);
      }
  }

  /*
    This function is called by displayZillowData.
    It calls getZillowData in the result service.
    If the call is successful, it adds the average returned to the table.
    If the call is unsuccessful, it tells the user that Zillow has no data for the city.
  */
  private getOpportunityZillow(oppName: string, city: string, id: string) {
    this.resultService.getZillowData(id).subscribe((data) => { //calls the getZillowData function, which uses the Zillow API
      if (data["average"] > 0) { //display the Zillow data
        var result: ZillowSet = {
          oppName: oppName,
          city: city,
          zillowData: this.auth.formatMoney(data["average"], true)
        };
        this.zillowResults.push(result);
      }
      this.zillowSource.data = this.zillowResults; //update the table
    }, (err) => {
      var result: ZillowSet = { //display the fact that there is no Zillow data
        oppName: oppName,
        city: city,
        zillowData: "Zillow does not have estimate data for this city."
      };
      this.zillowResults.push(result);
      this.zillowSource.data = this.zillowResults; //update the table
    });
  }

  /*
    This function is called when the user wants to update the number of months over which the graphs are generated.
  */
  public updateCharts() {
    this.generateCharts(this.chartForm.value.numberOfMonths, false);
    this.chartForm.reset();
  }

  /*
    This function is called when the user chooses to register an account after viewing the results page.
    First, the user's username is updated to the one that they have chosen.
    Then, their password is reset to the password that they have chosen.
    If any errors occur in the process, the user is notified.
  */
  public register() {
    var newUsername = this.registerForm.value.username;
    var newPassword = this.registerForm.value.password;
    if (newUsername === "" || newUsername.search(/dlcptwfcmc/i) > -1) { //the username uses our sequence for temporary usernames
      this.alerts.open("Sorry, that username has already been taken. Please try another!");
    } else {
      var updateUsername: UsernamePayload = {
        oldUsername: this.username,
        newUsername: newUsername,
        password: ""
      }
      var updatePassword: PasswordPayload = {
        username: newUsername,
        oldPassword: "",
        newPassword: newPassword
      }
      this.auth.changeUsername(updateUsername).subscribe(() => { //change the username
        this.auth.changePassword(updatePassword).subscribe(() => { //change the password
          this.alerts.open("Registered!");
        }, (err) => {
          console.log(err);
        });
      }, (err) => {
        if (err.error.code === 11000) { //a mongo error code that corresponds to duplicate key constraint violation
          this.alerts.open("Sorry, that username has already been taken. Please try another!");
        } else {
          console.log(err);
          this.router.navigateByUrl("/");
        }
      });
    }
  }

  /*
    On Init, this page first resets the chart form to invalidate the submit button.
    Then, it ensures that the user is logged in. If the user is logged in, it calls the getData function and loads the twitter buttons.
  */
  ngOnInit() {
    this.chartForm.reset();
    this.auth.callUpdateColor("results");
    this.username = this.auth.getUsername();
    if (this.username === null) {
      this.alerts.open("Please fill out the Profile page before accessing this page.");
      window.localStorage.setItem("profile-snackbar", "true");
      this.router.navigateByUrl("/profile");
    } else {
      this.getData(true);
      twttr.widgets.load();
    }
  }

}
