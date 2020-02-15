import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MustMatch} from '../../../validators/must-match';
import {MemberService} from '../../../services/member.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  signUpForm: FormGroup;

  constructor(private memberService: MemberService) {
  }

  ngOnInit() {
    this.init();
  }

  init() {
    this.signUpForm = new FormGroup({
      username: new FormControl(null, [Validators.required, Validators.email]),
      firstName: new FormControl(null, [Validators.required]),
      lastName: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
      passwordConfirm: new FormControl(null, [Validators.required])
    }, MustMatch('password', 'passwordConfirm'));
  }

  signUp() {
    this.memberService.singUp(this.signUpForm.getRawValue()).subscribe(
      res => console.log(res),
      error => console.log(error),
      () => console.log(this.init()));
  }
}
