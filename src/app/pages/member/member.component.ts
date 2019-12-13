import { Component, OnInit } from '@angular/core';
import {MemberService} from '../../services/member.service';
import {Member} from '../../interfaces/member';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css']
})
export class MemberComponent implements OnInit {
  public members: Member[];
  public dataSource: any;
  displayedColumns: string[] = ['memberNo', 'memberName'];
  constructor(private memberService: MemberService) { }


  ngOnInit() {
    this.getMemberInfo();
  }

  private async getMemberInfo(): Promise<void> {
    const res = await this.memberService.getMembers();
    this.members = res;
    this.dataSource = this.members;
  }
}
