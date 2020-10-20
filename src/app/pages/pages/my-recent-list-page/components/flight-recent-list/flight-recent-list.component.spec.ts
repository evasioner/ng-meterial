import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightRecentListComponent } from './flight-recent-list.component';

describe('FlightRecentListComponent', () => {
  let component: FlightRecentListComponent;
  let fixture: ComponentFixture<FlightRecentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightRecentListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightRecentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
