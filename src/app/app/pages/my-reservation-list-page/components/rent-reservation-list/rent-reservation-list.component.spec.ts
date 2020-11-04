import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RentReservationListComponent } from './rent-reservation-list.component';

describe('RentReservationListComponent', () => {
  let component: RentReservationListComponent;
  let fixture: ComponentFixture<RentReservationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RentReservationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RentReservationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
