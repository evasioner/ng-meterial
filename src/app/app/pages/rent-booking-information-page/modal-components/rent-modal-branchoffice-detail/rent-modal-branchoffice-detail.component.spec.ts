import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RentModalBranchofficeDetailComponent } from './rent-modal-branchoffice-detail.component';

describe('RentModalBranchofficeDetailComponent', () => {
  let component: RentModalBranchofficeDetailComponent;
  let fixture: ComponentFixture<RentModalBranchofficeDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RentModalBranchofficeDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RentModalBranchofficeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
