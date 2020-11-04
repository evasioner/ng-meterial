import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyReservationRentCancelPageComponent } from './my-reservation-rent-cancel-page.component';

describe('MyReservationRentCancelPageComponent', () => {
  let component: MyReservationRentCancelPageComponent;
  let fixture: ComponentFixture<MyReservationRentCancelPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyReservationRentCancelPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyReservationRentCancelPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
