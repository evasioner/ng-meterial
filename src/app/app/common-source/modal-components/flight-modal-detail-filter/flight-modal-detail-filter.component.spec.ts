import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightModalDetailFilterComponent } from './flight-modal-detail-filter.component';

describe('FlightModalDetailFilterComponent', () => {
  let component: FlightModalDetailFilterComponent;
  let fixture: ComponentFixture<FlightModalDetailFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightModalDetailFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightModalDetailFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
