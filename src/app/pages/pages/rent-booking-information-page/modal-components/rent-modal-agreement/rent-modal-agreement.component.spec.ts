import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RentModalAgreementComponent } from './rent-modal-agreement.component';

describe('RentModalAgreementComponent', () => {
  let component: RentModalAgreementComponent;
  let fixture: ComponentFixture<RentModalAgreementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RentModalAgreementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RentModalAgreementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
