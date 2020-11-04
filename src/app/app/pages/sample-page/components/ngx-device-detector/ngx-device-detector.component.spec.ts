import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxDeviceDetectorComponent } from './ngx-device-detector.component';

describe('NgxDeviceDetectorComponent', () => {
  let component: NgxDeviceDetectorComponent;
  let fixture: ComponentFixture<NgxDeviceDetectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxDeviceDetectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxDeviceDetectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
