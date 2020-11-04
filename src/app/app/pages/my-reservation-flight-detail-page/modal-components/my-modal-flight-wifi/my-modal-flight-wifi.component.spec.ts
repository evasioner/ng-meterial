import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyModalFlightWifiComponent } from './my-modal-flight-wifi.component';

describe('MyModalFlightWifiComponent', () => {
  let component: MyModalFlightWifiComponent;
  let fixture: ComponentFixture<MyModalFlightWifiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyModalFlightWifiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyModalFlightWifiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
