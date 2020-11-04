import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityCustomerEventComponent } from './activity-customer-event.component';

describe('ActivityCustomerEventComponent', () => {
  let component: ActivityCustomerEventComponent;
  let fixture: ComponentFixture<ActivityCustomerEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityCustomerEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityCustomerEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
