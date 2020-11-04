import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonModalCalendarComponent } from './common-modal-calendar.component';

describe('CommonModalCalendarComponent', () => {
  let component: CommonModalCalendarComponent;
  let fixture: ComponentFixture<CommonModalCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonModalCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonModalCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
