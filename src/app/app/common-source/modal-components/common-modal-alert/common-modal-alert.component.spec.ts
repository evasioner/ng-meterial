import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonModalAlertComponent } from './common-modal-alert.component';

describe('CommonModalAlertComponent', () => {
  let component: CommonModalAlertComponent;
  let fixture: ComponentFixture<CommonModalAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonModalAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonModalAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
