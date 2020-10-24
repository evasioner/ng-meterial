import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TestService} from './services/test.service';
import {AllRange} from './interfaces/AllRange';
import {State} from './interfaces/State';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy, OnInit {
  title = 'ng-material';

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  public allRange: AllRange;
  public searchForm: FormGroup;
  public states: any;


  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private fb: FormBuilder, private testService: TestService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    this.initForm();
    this.getTest();
  }


  public getTest() {
    this.testService.getTests().subscribe(
      (data: AllRange) => {
        this.allRange = data;
        console.log(this.allRange);
      }, (error) => {
        console.log(error);
      });
  }

  get dd(): AllRange {
    return this.allRange;
  }


  initForm() {
    this.states = State;
    this.searchForm = this.fb.group({
      id: ['', []],
      offerId: ['', [Validators.required]],
      aaa: ['', [Validators.required]],
      bbb: ['', [Validators.required]],
      ccc: ['', [Validators.required]],
    });
  }

  onSubmit() {
  }


  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
