import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityReservationListComponent } from './activity-reservation-list.component';

describe('ActivityReservationListComponent', () => {
  let component: ActivityReservationListComponent;
  let fixture: ComponentFixture<ActivityReservationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityReservationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityReservationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
