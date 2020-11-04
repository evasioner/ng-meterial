import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RentModalAlignFilterComponent } from './rent-modal-align-filter.component';

describe('RentModalAlignFilterComponent', () => {
  let component: RentModalAlignFilterComponent;
  let fixture: ComponentFixture<RentModalAlignFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RentModalAlignFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RentModalAlignFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
