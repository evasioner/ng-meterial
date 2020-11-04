import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyModalActivityVoucherComponent } from './my-modal-activity-voucher.component';

describe('MyModalActivityVoucherComponent', () => {
  let component: MyModalActivityVoucherComponent;
  let fixture: ComponentFixture<MyModalActivityVoucherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyModalActivityVoucherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyModalActivityVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
