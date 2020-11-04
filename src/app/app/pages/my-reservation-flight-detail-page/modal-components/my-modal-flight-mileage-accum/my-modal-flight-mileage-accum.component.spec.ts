import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyModalFlightMileageAccumComponent } from './my-modal-flight-mileage-accum.component';

describe('MyModalFlightMileageAccumComponent', () => {
  let component: MyModalFlightMileageAccumComponent;
  let fixture: ComponentFixture<MyModalFlightMileageAccumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyModalFlightMileageAccumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyModalFlightMileageAccumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
