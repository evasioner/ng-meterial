import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityCitySearchComponent } from './activity-city-search.component';

describe('ActivityCitySearchComponent', () => {
  let component: ActivityCitySearchComponent;
  let fixture: ComponentFixture<ActivityCitySearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityCitySearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityCitySearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
