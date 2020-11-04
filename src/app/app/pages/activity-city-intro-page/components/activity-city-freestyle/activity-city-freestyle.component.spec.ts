import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityCityFreestyleComponent } from './activity-city-freestyle.component';

describe('ActivityCityFreestyleComponent', () => {
  let component: ActivityCityFreestyleComponent;
  let fixture: ComponentFixture<ActivityCityFreestyleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityCityFreestyleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityCityFreestyleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
