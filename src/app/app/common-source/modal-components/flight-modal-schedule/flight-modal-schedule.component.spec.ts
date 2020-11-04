import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightModalScheduleComponent } from './flight-modal-schedule.component';

describe('FlightModalScheduleComponent', () => {
  let component: FlightModalScheduleComponent;
  let fixture: ComponentFixture<FlightModalScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightModalScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightModalScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
