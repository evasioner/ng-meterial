import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyModalRentWifiComponent } from './my-modal-rent-wifi.component';

describe('MyModalRentWifiComponent', () => {
  let component: MyModalRentWifiComponent;
  let fixture: ComponentFixture<MyModalRentWifiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyModalRentWifiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyModalRentWifiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
