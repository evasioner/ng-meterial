import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RentModalDemandsComponent } from './rent-modal-demands.component';

describe('RentModalDemandsComponent', () => {
  let component: RentModalDemandsComponent;
  let fixture: ComponentFixture<RentModalDemandsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RentModalDemandsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RentModalDemandsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
