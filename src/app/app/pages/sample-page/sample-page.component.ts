import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { environment } from '@/environments/environment';

@Component({
  selector: 'app-sample-page',
  templateUrl: './sample-page.component.html',
  styleUrls: ['./sample-page.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SamplePageComponent implements OnInit {

  env = environment;

  constructor() { }

  ngOnInit() {
  }

}
