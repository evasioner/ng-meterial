import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelSearchResultPageComponent } from './hotel-search-result-page.component';

describe('HotelSearchResultPageComponent', () => {
  let component: HotelSearchResultPageComponent;
  let fixture: ComponentFixture<HotelSearchResultPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelSearchResultPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelSearchResultPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
