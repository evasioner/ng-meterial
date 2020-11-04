import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightModalScheduleInformationComponent } from './flight-modal-schedule-information.component';

describe('FlightModalScheduleInformationComponent', () => {
  let component: FlightModalScheduleInformationComponent;
  let fixture: ComponentFixture<FlightModalScheduleInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightModalScheduleInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightModalScheduleInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
