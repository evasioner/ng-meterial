import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightHeaderComponent } from './flight-header.component';

describe('FlightHeaderComponent', () => {
  let component: FlightHeaderComponent;
  let fixture: ComponentFixture<FlightHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
