import { Component, OnInit } from '@angular/core';
import * as moment from "moment";

@Component({
  selector: 'app-ngx-moment',
  templateUrl: './ngx-moment.component.html',
  styleUrls: ['./ngx-moment.component.scss']
})
export class NgxMomentComponent implements OnInit {

  myDate: any;
  nextDay: Date;
  formats: string[] = ['DD/MM/YYYY HH:mm:ss', 'DD/MM/YYYY HH:mm'];
  formats2: string[] = ['DD/MM/YYYY HH:mm:ss', 'DD/MM/YYYY HH:mmZZ'];
  momentDate = '2020-03-05 12:30';

  constructor() { }

  ngOnInit() {
    this.myDate = Date.now();
    this.nextDay = new Date();
    this.nextDay.setDate(this.nextDay.getDate() + 1);
  }

}
