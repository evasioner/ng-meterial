import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticeListHotelComponent } from './notice-list-hotel.component';

describe('NoticeListHotelComponent', () => {
  let component: NoticeListHotelComponent;
  let fixture: ComponentFixture<NoticeListHotelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoticeListHotelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticeListHotelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
