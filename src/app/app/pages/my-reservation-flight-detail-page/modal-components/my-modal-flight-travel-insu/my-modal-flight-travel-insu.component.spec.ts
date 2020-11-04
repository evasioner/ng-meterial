import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyModalFlightTravelInsuComponent } from './my-modal-flight-travel-insu.component';

describe('MyModalFlightTravelInsuComponent', () => {
  let component: MyModalFlightTravelInsuComponent;
  let fixture: ComponentFixture<MyModalFlightTravelInsuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyModalFlightTravelInsuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyModalFlightTravelInsuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
