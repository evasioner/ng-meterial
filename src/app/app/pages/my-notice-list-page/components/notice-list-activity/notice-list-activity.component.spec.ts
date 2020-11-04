import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticeListActivityComponent } from './notice-list-activity.component';

describe('NoticeListActivityComponent', () => {
  let component: NoticeListActivityComponent;
  let fixture: ComponentFixture<NoticeListActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoticeListActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticeListActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
