import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyModalHotelVoucherComponent } from './my-modal-hotel-voucher.component';

describe('MyModalHotelVoucherComponent', () => {
  let component: MyModalHotelVoucherComponent;
  let fixture: ComponentFixture<MyModalHotelVoucherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyModalHotelVoucherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyModalHotelVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
