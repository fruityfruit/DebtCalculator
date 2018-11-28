import { Component, OnInit } from '@angular/core';
import { db } from '../../../server/config/mongoose.js';
import { userModel } from '../../../app/models/user.js';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor() { }

  ngOnInit() { }

  registerUser() {
    var userName = document.getElementById('username');
    var passWord = document.getElementById('password');
    var user = new userModel({username:userName, password:passWord});
    db.once('open', function callback() {
      user.save();

    });
  }

}
