import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyModalNoticeViewComponent } from './my-modal-notice-view.component';

describe('MyModalNoticeViewComponent', () => {
  let component: MyModalNoticeViewComponent;
  let fixture: ComponentFixture<MyModalNoticeViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyModalNoticeViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyModalNoticeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
