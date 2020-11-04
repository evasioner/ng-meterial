import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityCalendarComponent } from './activity-calendar.component';

describe('ActivityCalendarComponent', () => {
  let component: ActivityCalendarComponent;
  let fixture: ComponentFixture<ActivityCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
