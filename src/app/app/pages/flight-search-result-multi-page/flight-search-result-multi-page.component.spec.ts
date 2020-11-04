import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightSearchResultMultiPageComponent } from './flight-search-result-multi-page.component';

describe('FlightSearchResultMultiPageComponent', () => {
  let component: FlightSearchResultMultiPageComponent;
  let fixture: ComponentFixture<FlightSearchResultMultiPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightSearchResultMultiPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightSearchResultMultiPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
