import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticeListRentComponent } from './notice-list-rent.component';

describe('NoticeListRentComponent', () => {
  let component: NoticeListRentComponent;
  let fixture: ComponentFixture<NoticeListRentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoticeListRentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticeListRentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
