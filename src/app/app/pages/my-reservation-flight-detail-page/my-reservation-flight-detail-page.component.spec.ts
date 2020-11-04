import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyReservationFlightDetailPageComponent } from './my-reservation-flight-detail-page.component';

describe('MyReservationFlightDetailPageComponent', () => {
  let component: MyReservationFlightDetailPageComponent;
  let fixture: ComponentFixture<MyReservationFlightDetailPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyReservationFlightDetailPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyReservationFlightDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
