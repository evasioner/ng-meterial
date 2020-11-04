import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightHotListComponent } from './flight-hot-list.component';

describe('FlightHotListComponent', () => {
  let component: FlightHotListComponent;
  let fixture: ComponentFixture<FlightHotListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightHotListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightHotListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
