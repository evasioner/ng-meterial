import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RentModalBranchofficeComponent } from './rent-modal-branchoffice.component';

describe('RentModalBranchofficeComponent', () => {
  let component: RentModalBranchofficeComponent;
  let fixture: ComponentFixture<RentModalBranchofficeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RentModalBranchofficeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RentModalBranchofficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
