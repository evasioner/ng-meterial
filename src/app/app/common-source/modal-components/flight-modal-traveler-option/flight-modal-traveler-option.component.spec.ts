import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightModalTravelerOptionComponent } from './flight-modal-traveler-option.component';

describe('FlightModalTravelerOptionComponent', () => {
  let component: FlightModalTravelerOptionComponent;
  let fixture: ComponentFixture<FlightModalTravelerOptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightModalTravelerOptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightModalTravelerOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
