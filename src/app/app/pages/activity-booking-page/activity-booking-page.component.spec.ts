import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityBookingPageComponent } from './activity-booking-page.component';

describe('ActivityBookingPageComponent', () => {
  let component: ActivityBookingPageComponent;
  let fixture: ComponentFixture<ActivityBookingPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityBookingPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityBookingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
