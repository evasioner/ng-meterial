import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-agm',
  templateUrl: './agm.component.html',
  styleUrls: ['./agm.component.scss']
})
export class AgmComponent implements OnInit {

  lat: number = 37.564124;
  lng: number = 126.989822;

  constructor() { }

  ngOnInit() {
  }

}
