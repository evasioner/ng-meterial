import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RentModalDetailFilterComponent } from './rent-modal-detail-filter.component';

describe('RentModalDetailFilterComponent', () => {
  let component: RentModalDetailFilterComponent;
  let fixture: ComponentFixture<RentModalDetailFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RentModalDetailFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RentModalDetailFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
