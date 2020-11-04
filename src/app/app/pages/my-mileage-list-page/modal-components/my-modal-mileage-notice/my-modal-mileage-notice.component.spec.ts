import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyModalMileageNoticeComponent } from './my-modal-mileage-notice.component';

describe('MyModalMileageNoticeComponent', () => {
  let component: MyModalMileageNoticeComponent;
  let fixture: ComponentFixture<MyModalMileageNoticeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyModalMileageNoticeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyModalMileageNoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
