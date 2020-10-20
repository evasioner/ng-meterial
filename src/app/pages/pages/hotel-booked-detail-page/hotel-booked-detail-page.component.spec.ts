import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelBookedDetailPageComponent } from './hotel-booked-detail-page.component';

describe('HotelBookedDetailPageComponent', () => {
  let component: HotelBookedDetailPageComponent;
  let fixture: ComponentFixture<HotelBookedDetailPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelBookedDetailPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelBookedDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
