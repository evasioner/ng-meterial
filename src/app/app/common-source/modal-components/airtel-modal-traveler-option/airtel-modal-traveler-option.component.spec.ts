import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AirtelModalTravelerOptionComponent } from './airtel-modal-traveler-option.component';

describe('AirtelModalTravelerOptionComponent', () => {
  let component: AirtelModalTravelerOptionComponent;
  let fixture: ComponentFixture<AirtelModalTravelerOptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AirtelModalTravelerOptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirtelModalTravelerOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
