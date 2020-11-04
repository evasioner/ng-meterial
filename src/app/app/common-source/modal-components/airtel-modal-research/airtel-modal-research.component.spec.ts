import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AirtelModalResearchComponent } from './airtel-modal-research.component';

describe('AirtelModalResearchComponent', () => {
  let component: AirtelModalResearchComponent;
  let fixture: ComponentFixture<AirtelModalResearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AirtelModalResearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirtelModalResearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
