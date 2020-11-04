import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';



@Component({
  selector: 'app-coupon-zone',
  templateUrl: './coupon-zone.component.html',
  styleUrls: ['./coupon-zone.component.scss']
})
export class CouponZoneComponent implements OnInit {
  
  bsModalRef: BsModalRef;
  constructor(
  public bsModalService: BsModalService,
  ) { }
  ngOnInit(): void {
  }

}
