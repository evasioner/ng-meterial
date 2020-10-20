import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightMainSearchComponent } from './flight-main-search.component';

describe('FlightMainSearchComponent', () => {
  let component: FlightMainSearchComponent;
  let fixture: ComponentFixture<FlightMainSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightMainSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightMainSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
