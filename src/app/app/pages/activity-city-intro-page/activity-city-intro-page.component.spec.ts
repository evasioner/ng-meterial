import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityCityIntroPageComponent } from './activity-city-intro-page.component';

describe('ActivityCityIntroPageComponent', () => {
  let component: ActivityCityIntroPageComponent;
  let fixture: ComponentFixture<ActivityCityIntroPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityCityIntroPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityCityIntroPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
