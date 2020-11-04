import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityCustomerFreestyleComponent } from './activity-customer-freestyle.component';

describe('ActivityCustomerFreestyleComponent', () => {
  let component: ActivityCustomerFreestyleComponent;
  let fixture: ComponentFixture<ActivityCustomerFreestyleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityCustomerFreestyleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityCustomerFreestyleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
