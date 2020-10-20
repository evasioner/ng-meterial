import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyModalHotelReceiptComponent } from './my-modal-hotel-receipt.component';

describe('MyModalHotelReceiptComponent', () => {
  let component: MyModalHotelReceiptComponent;
  let fixture: ComponentFixture<MyModalHotelReceiptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyModalHotelReceiptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyModalHotelReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
