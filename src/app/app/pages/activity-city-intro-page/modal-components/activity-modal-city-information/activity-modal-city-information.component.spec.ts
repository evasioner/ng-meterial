import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityModalCityInformationComponent } from './activity-modal-city-information.component';

describe('ActivityModalCityInformationComponent', () => {
  let component: ActivityModalCityInformationComponent;
  let fixture: ComponentFixture<ActivityModalCityInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityModalCityInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityModalCityInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
