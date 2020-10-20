import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyModalHotelInvoiceComponent } from './my-modal-hotel-invoice.component';

describe('MyModalHotelInvoiceComponent', () => {
  let component: MyModalHotelInvoiceComponent;
  let fixture: ComponentFixture<MyModalHotelInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyModalHotelInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyModalHotelInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
