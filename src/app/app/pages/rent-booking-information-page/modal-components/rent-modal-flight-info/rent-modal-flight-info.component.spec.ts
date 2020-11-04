import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RentModalFlightInfoComponent } from './rent-modal-flight-info.component';

describe('RentModalFlightInfoComponent', () => {
  let component: RentModalFlightInfoComponent;
  let fixture: ComponentFixture<RentModalFlightInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RentModalFlightInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RentModalFlightInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
