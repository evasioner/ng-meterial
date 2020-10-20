import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightMainPageComponent } from './flight-main-page.component';

describe('FlightMainPageComponent', () => {
  let component: FlightMainPageComponent;
  let fixture: ComponentFixture<FlightMainPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightMainPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
