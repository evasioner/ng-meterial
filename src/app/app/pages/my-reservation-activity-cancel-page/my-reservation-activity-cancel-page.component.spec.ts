import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyReservationActivityCancelPageComponent } from './my-reservation-activity-cancel-page.component';

describe('MyReservationActivityCancelPageComponent', () => {
  let component: MyReservationActivityCancelPageComponent;
  let fixture: ComponentFixture<MyReservationActivityCancelPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyReservationActivityCancelPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyReservationActivityCancelPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
