import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService, PasswordPayload, UsernamePayload} from '../authentication.service';
import { OpportunityService, Opportunity } from '../opportunity.service';
import { ResultService, ResultSet } from '../result.service';
import { ProfileService, Profile, Debt } from '../profile.service';
import { Router } from '@angular/router';
import {MatTableDataSource} from '@angular/material';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})

export class ResultsComponent implements OnInit {
  username: string = '';
  zillowResults: ResultSet[] = [];
  debtChart = [];
  salaryChart = [];
  debtProjection=[] as Chart;
  netIncome=[] as Chart;
  netIncomeTemp=[];
  profile: Profile = {
    username: "",
    state: "",
    region: "",
    dependents: 0,
    rent: 0,
    spending: 0,
    pets: 0
  };
  loop : Number =20;
  debts: Debt[] = [];
  opportunities: Opportunity[] = [];
  newUsername: string;
  newPassword: string;
  dataSource = new MatTableDataSource(this.zillowResults);
  displayedColumns: string[] = ['name', 'city', 'estimate'];

  constructor(public auth: AuthenticationService,
    private resultService: ResultService,
    private oppService: OpportunityService,
    private profService: ProfileService,
    private router: Router) { }

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
          this.generateCharts(); //generate the charts using the data that we've just collected
        }, (err) => {
          console.log(err);
        });
      }, (err) => {
        console.log(err);
      });
    }

    private generateCharts() {
      var colors=['DarkGreen','aqua','Indigo','maroon','SkyBlue','Magenta','Pink','Gold','Salmon'];

/*
  READ THIS

  I have commented out the graph generation portion because i think that we have changed the data that we have so much that
  trying to edit the old graphs that I didn't write would be very hard.
  Here's what I've done to the file:
  By the time this function is called, this.opportunities and this.debts contain all of the opportunities and
  debts that the user has. Each opportunity may have a debt (4 characteristics) and/or an income. this.debts
  contains the debts that the user has regardless of the opportunity (this is entered on the personal page).
  To see what a "Debt" or what an "Opportunity" is, check out the profile.service and opportunity.service files,
  which is where they are defined.
  Also, this.profile contains the user's profile, which has their rent, dependents, monthly spending, etc.
*/

      //this gives you auth back in data as a profile type, shows correctly in console
      // this.resultService.getChartsData(this.username).subscribe((data: Opportunity[]) => {
      //   this.auth.getProfile(this.username).subscribe((data2: Profile) => {
        //  var intrestRate = data2.interest;
          //var principle= data2.debt;
          //var yearlyPayment= data2.payments*12;
          //assume yearly interest
          var debtProjectionPoints=[];
          var labels=[];
          var netPoints=[];
          var debtnames=[];
          var num = 0;
          var counter=0;
          while(counter<this.debts.length)
          {
            var points=[];
            var name="Debt Source " + (+counter+1);
            debtnames.push(name);
            while(num<=this.loop){
            //  var calculatedDebt=principle*(1+intrestRate*num/100);
            var debt=this.debts[counter];
            var calculatedDebt=0;
            calculatedDebt= +debt.principal*(1+ +debt.rate*num/100);
            if (counter==0){
              labels.push(num);
            }
              points.push(calculatedDebt);
              num=num+1;
            }
            debtProjectionPoints.push(points);
            counter=counter+1;
            num=0;
          }
          this.debtProjection = new Chart('canvas3', {
            type: 'line',
            data: {
              labels: labels,
              datasets: [{
                label: debtnames[0],
                data: debtProjectionPoints[0],
                borderColor: colors[0],
               pointBackgroundColor: colors[0],
               backgroundColor: 'transparent'
              }],
            },
          });
          var counter =1;
          while(counter<this.debts.length){
            var newSeries = {
              label: debtnames[counter],
              data: debtProjectionPoints[counter],
              borderColor: colors[counter],
              pointBackgroundColor: colors[counter],
              backgroundColor: 'transparent'

                 };
                 this.debtProjection.data['datasets'][counter]=newSeries;
                 this.debtProjection.update();
                 counter =counter+1;
          }
          if(this.debts.length>1){
          var num=0;
          while (num<=this.loop){
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
            pointBackgroundColor: 'red',
            backgroundColor: 'transparent'
            };
            this.debtProjection.data['datasets'][counter]=newSeries2;
            this.debtProjection.update();
          }
          var yearlyPaymentDebts=[];
          var netIncomePoints=[];
          var debtCounter=0;
            while(debtCounter<this.debts.length){
              var yearly = [];
          //    yearly.push(+this.debts[debtCounter].monthlyPayment*12);
              var num=0;
              var total= +this.debts[debtCounter].principal;
              while (num<=this.loop){
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
             var yearly=[];
             var num=0;
             var total = +this.opportunities[oppCounter].principal;
             while(num<=this.loop){
               total=total + (+this.opportunities[oppCounter].principal* +this.opportunities[oppCounter].rate/100) - (+this.opportunities[oppCounter].monthlyPayment*12);
               if (total>=0){
                 yearly.push(+this.opportunities[oppCounter].monthlyPayment*12);
               }
               else {
                 yearly.push(0);
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
        while(num<=this.loop){
          var debtLoop=0;
          while (debtLoop<yearlyPaymentDebts.length){
            total=total - +yearlyPaymentDebts[debtLoop][num];
            debtLoop=debtLoop+1;
          }
          total=total- +yearlyPaymentOpp[oppCounter][num];
          net.push(total);
          total=total+ +this.opportunities[oppCounter].income;
          num=num+1;
        }
        netPoints.push(net);
        oppCounter=oppCounter+1;
      }
      //console.log(netPoints);
          this.netIncome = new Chart('canvas4', {
            title: {
              display: true,
              text:"Debt Projection from Opportunities",
            },
            legend: {
              horizontalAlign: "center", // "left" , "right"
              verticalAlign: "bottom",  // "top" , "center"
              fontSize: 15
            },
            type: 'line',
            data: {
              labels: labels,
              datasets: [{
                label: oppNameList[0],
                data: netPoints[0],
                borderColor: colors[0],
                pointBackgroundColor: colors[0],
                backgroundColor: 'transparent'
              }],
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

          var oppCounter=1;
          while(oppCounter<this.opportunities.length){
          var newSeries3 = {
            data: netPoints[oppCounter],
            label: oppNameList[oppCounter],
            borderColor: colors[oppCounter],
            pointBackgroundColor: colors[oppCounter],
            backgroundColor: 'transparent'
          };
            this.netIncome.data['datasets'][oppCounter]=newSeries3;
            this.netIncome.update();
            oppCounter=oppCounter+1;
          }

      //     var numOpp=0;
      //     var netIncomeTemp=[];
      //     var opportunities = data['opportunities'];
      //     var oppNameList=[];
      //     opportunities.forEach(function(item, index) {
      //       var num = 0;
      //       var net:number =0;
      //       oppNameList.push(item.oppName);
      //       while(num<=20){
      //         var calculatedDebt=principle*(1+intrestRate*num/100);
      //         var amountOwed=calculatedDebt-yearlyPayment*num;
      //         if(item.oppCost>0){
      //           console.log(net);
      //           if (amountOwed>0){
      //             var total=item.oppCost*(num+1);
      //             net=total-yearlyPayment;
      //             netPoints.push(net);
      //           }
      //           else{
      //             var total:number = item.oppCost;
      //             net= +net+ +total;
      //             netPoints.push(<number>net);
      //           }
      //         }
      //         else {
      //           netPoints.push(-1*calculatedDebt)
      //         }
      //         //console.log(total-calculatedDebt);
      //         num=num+1;
      //       }
      //       netIncomeTemp.push(netPoints);
      //       netPoints=[];
      //       numOpp=numOpp+1;
      //     });


      //       //this.netIncome.render();
      //       //this.netIncome.options.data(netIncomeTemp[1]);
      //       num=num+1;
      //
      //     }
      //   });
      //
        var oppNames = [];
        var oppDebts = [];
        var oppCosts = [];
        var counter =0;
        while (counter< this.opportunities.length){
          oppNames.push(this.opportunities[counter].name);
          oppDebts.push(this.opportunities[counter].principal);
          oppCosts.push(this.opportunities[counter].income);
          counter=counter+1;
        }
      //
      //
        this.debtChart = new Chart('canvas0', {
          type: "bar",
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
      //
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
      // }, (err) => {
      //   console.log(err);
      // });
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

    public register() {
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
        var regions = [];
        var names = [];
        data['opportunities'].forEach(function(item, index) {
          names.push(item.name);
          regions.push(item.region);
          console.log(item.region);
        });
        this.resultService.getBLSData(regions).subscribe((data) => {
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

        this.displayZillowData();
        this.displayBLSData();
        this.getData();
      }
    }

  }
