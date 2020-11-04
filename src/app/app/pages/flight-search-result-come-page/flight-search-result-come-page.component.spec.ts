import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightSearchResultComePageComponent } from './flight-search-result-come-page.component';

describe('FlightSearchResultComePageComponent', () => {
  let component: FlightSearchResultComePageComponent;
  let fixture: ComponentFixture<FlightSearchResultComePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightSearchResultComePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightSearchResultComePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
