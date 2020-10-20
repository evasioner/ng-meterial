import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelSearchResultMapPageComponent } from './hotel-search-result-map-page.component';

describe('HotelSearchResultMapPageComponent', () => {
  let component: HotelSearchResultMapPageComponent;
  let fixture: ComponentFixture<HotelSearchResultMapPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelSearchResultMapPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelSearchResultMapPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
