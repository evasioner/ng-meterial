import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyModalActivityWifiComponent } from './my-modal-activity-wifi.component';

describe('MyModalActivityWifiComponent', () => {
  let component: MyModalActivityWifiComponent;
  let fixture: ComponentFixture<MyModalActivityWifiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyModalActivityWifiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyModalActivityWifiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
