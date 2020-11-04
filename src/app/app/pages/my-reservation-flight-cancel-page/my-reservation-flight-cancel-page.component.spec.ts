import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyReservationFlightCancelPageComponent } from './my-reservation-flight-cancel-page.component';

describe('MyReservationFlightCancelPageComponent', () => {
  let component: MyReservationFlightCancelPageComponent;
  let fixture: ComponentFixture<MyReservationFlightCancelPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyReservationFlightCancelPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyReservationFlightCancelPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
