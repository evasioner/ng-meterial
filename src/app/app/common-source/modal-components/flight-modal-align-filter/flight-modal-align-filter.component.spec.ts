import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightModalAlignFilterComponent } from './flight-modal-align-filter.component';

describe('FlightModalAlignFilterComponent', () => {
  let component: FlightModalAlignFilterComponent;
  let fixture: ComponentFixture<FlightModalAlignFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightModalAlignFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightModalAlignFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
