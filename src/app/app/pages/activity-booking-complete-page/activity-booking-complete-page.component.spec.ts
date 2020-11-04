import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityBookingCompletePageComponent } from './activity-booking-complete-page.component';

describe('ActivityBookingCompletePageComponent', () => {
  let component: ActivityBookingCompletePageComponent;
  let fixture: ComponentFixture<ActivityBookingCompletePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityBookingCompletePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityBookingCompletePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
