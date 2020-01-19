import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthCheckService} from '../../../services/auth-check.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  signUpForm: FormGroup;

  constructor(private authCheckService: AuthCheckService) {
  }

  ngOnInit() {
    this.signUpForm = new FormGroup({
      username: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required])
    });
  }

  async signUp() {
    const res = this.authCheckService.signUp(this.signUpForm.getRawValue());
    console.log(res);
  }

}
