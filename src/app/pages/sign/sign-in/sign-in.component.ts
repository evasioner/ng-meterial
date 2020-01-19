import {Component, OnInit} from '@angular/core';
import {AuthCheckService} from '../../../services/auth-check.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  signForm: FormGroup;

  constructor(private authCheckService: AuthCheckService) {
  }

  ngOnInit() {
    this.signForm = new FormGroup({
      username: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required])
    });
  }

  async signIn() {
    const res = this.authCheckService.signIn(this.signForm.getRawValue());
    console.log(res);
  }
}

