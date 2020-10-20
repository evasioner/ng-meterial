import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RentModalCompareComponent } from './rent-modal-compare.component';

describe('RentModalCompareComponent', () => {
  let component: RentModalCompareComponent;
  let fixture: ComponentFixture<RentModalCompareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RentModalCompareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RentModalCompareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
