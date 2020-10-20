import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AirtelReservationListComponent } from './airtel-reservation-list.component';

describe('AirtelReservationListComponent', () => {
  let component: AirtelReservationListComponent;
  let fixture: ComponentFixture<AirtelReservationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AirtelReservationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirtelReservationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
