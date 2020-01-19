import {Component, OnInit} from '@angular/core';
import {MemberService} from '../../services/member.service';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css']
})
export class MemberComponent implements OnInit {
  options;
  myControl = new FormControl();

  constructor(private memberService: MemberService) {
  }


  ngOnInit() {
  }

  private async search(): Promise<void> {
    const res = await this.memberService.search({'query': this.myControl.value});
    this.options = res;
  }

  // private async register(): Promise<void> {
  //   const res = await
  // }

  // private async getMemberInfo(): Promise<void> {
  //   const res = await this.memberService.getMembers();
  //   this.members = res.data;
  // }
}
