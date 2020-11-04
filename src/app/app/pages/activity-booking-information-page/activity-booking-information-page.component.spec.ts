import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityBookingInformationPageComponent } from './activity-booking-information-page.component';

describe('ActivityBookingInformationPageComponent', () => {
  let component: ActivityBookingInformationPageComponent;
  let fixture: ComponentFixture<ActivityBookingInformationPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityBookingInformationPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityBookingInformationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
