import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyReservationRentDetailPageComponent } from './my-reservation-rent-detail-page.component';

describe('MyReservationRentDetailPageComponent', () => {
  let component: MyReservationRentDetailPageComponent;
  let fixture: ComponentFixture<MyReservationRentDetailPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyReservationRentDetailPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyReservationRentDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
