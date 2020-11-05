import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightNewSearchListComponent } from './flight-new-search-list.component';

describe('FlightNewSearchListComponent', () => {
  let component: FlightNewSearchListComponent;
  let fixture: ComponentFixture<FlightNewSearchListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightNewSearchListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightNewSearchListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});