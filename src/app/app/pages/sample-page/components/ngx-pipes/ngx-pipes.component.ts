import { Component, OnInit } from '@angular/core';
import {ReversePipe} from 'ngx-pipes';

@Component({
  selector: 'app-ngx-pipes',
  templateUrl: './ngx-pipes.component.html',
  styleUrls: ['./ngx-pipes.component.scss'],
  providers: [
    ReversePipe
  ]
})
export class NgxPipesComponent implements OnInit {

  reversePipeVal: any;

  constructor(private reversePipe: ReversePipe) {

  }

  ngOnInit() {
    this.reversePipeVal = this.reversePipe.transform('foo'); // Returns: "oof"
  }

}
