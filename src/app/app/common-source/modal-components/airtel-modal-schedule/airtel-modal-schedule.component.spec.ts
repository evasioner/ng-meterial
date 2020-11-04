import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AirtelModalScheduleComponent } from './airtel-modal-schedule.component';

describe('AirtelModalScheduleComponent', () => {
  let component: AirtelModalScheduleComponent;
  let fixture: ComponentFixture<AirtelModalScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AirtelModalScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirtelModalScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
