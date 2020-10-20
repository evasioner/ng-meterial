import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightModalAgreementComponent } from './flight-modal-agreement.component';

describe('FlightModalAgreementComponent', () => {
  let component: FlightModalAgreementComponent;
  let fixture: ComponentFixture<FlightModalAgreementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightModalAgreementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightModalAgreementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
