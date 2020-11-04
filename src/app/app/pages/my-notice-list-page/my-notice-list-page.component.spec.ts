import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyNoticeListPageComponent } from './my-notice-list-page.component';

describe('MyNoticeListPageComponent', () => {
  let component: MyNoticeListPageComponent;
  let fixture: ComponentFixture<MyNoticeListPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyNoticeListPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyNoticeListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
