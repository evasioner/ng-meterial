import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityCityTravelPlanComponent } from './activity-city-travel-plan.component';

describe('ActivityCityTravelPlanComponent', () => {
  let component: ActivityCityTravelPlanComponent;
  let fixture: ComponentFixture<ActivityCityTravelPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityCityTravelPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityCityTravelPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
