import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-sample',
  templateUrl: './sample.component.html',
  styleUrls: ['./sample.component.css']
})
export class SampleComponent implements OnInit {
  public types = {
    'flight': {
      'usedDate': '이용일자',
      'flightNumber': '비행기번호',
    },
    'hotel': {
      'usedDate': '이용일자',
      'hotelNumber': '호텔번호',
      'hotelFloor': '호텔층',
    },
    'rent': {
      'usedDate': '이용일자',
      'rentNumber': '렌트번호',
    },
    'aa': {
      'usedDate': '사용일자',
      'rentNumber': '테스트',
    },
  };


  public state;

  constructor() {
  }

  ngOnInit() {
    this.state = 'aa';
  }

  onClick() {

  }

  public onSearchResult(event: any, index: number): void {


  }
}
