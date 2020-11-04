import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityCityHotplaceComponent } from './activity-city-hotplace.component';

describe('ActivityCityHotplaceComponent', () => {
  let component: ActivityCityHotplaceComponent;
  let fixture: ComponentFixture<ActivityCityHotplaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityCityHotplaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityCityHotplaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
