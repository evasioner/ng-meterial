import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AirtelTravelerInformationPageComponent } from './airtel-traveler-information-page.component';

describe('AirtelTravelerInformationPageComponent', () => {
  let component: AirtelTravelerInformationPageComponent;
  let fixture: ComponentFixture<AirtelTravelerInformationPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AirtelTravelerInformationPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirtelTravelerInformationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
