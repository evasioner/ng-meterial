import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyModalRentInvoiceComponent } from './my-modal-rent-invoice.component';

describe('MyModalRentInvoiceComponent', () => {
  let component: MyModalRentInvoiceComponent;
  let fixture: ComponentFixture<MyModalRentInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyModalRentInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyModalRentInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
