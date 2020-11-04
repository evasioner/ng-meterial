import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightSearchResultGoPageComponent } from './flight-search-result-go-page.component';

describe('FlightSearchResultGoPageComponent', () => {
  let component: FlightSearchResultGoPageComponent;
  let fixture: ComponentFixture<FlightSearchResultGoPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightSearchResultGoPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightSearchResultGoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
