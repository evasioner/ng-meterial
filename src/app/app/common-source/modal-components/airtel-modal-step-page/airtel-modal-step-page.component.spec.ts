import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AirtelModalStepPageComponent } from './airtel-modal-step-page.component';

describe('AirtelModalStepPageComponent', () => {
  let component: AirtelModalStepPageComponent;
  let fixture: ComponentFixture<AirtelModalStepPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AirtelModalStepPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirtelModalStepPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
