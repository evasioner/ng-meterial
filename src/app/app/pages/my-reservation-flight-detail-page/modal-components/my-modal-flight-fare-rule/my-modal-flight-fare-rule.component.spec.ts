import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyModalFlightFareRuleComponent } from './my-modal-flight-fare-rule.component';

describe('MyModalFlightFareRuleComponent', () => {
  let component: MyModalFlightFareRuleComponent;
  let fixture: ComponentFixture<MyModalFlightFareRuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyModalFlightFareRuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyModalFlightFareRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
