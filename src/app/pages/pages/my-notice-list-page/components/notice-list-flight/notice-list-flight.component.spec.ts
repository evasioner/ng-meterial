import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticeListFlightComponent } from './notice-list-flight.component';

describe('NoticeListFlightComponent', () => {
  let component: NoticeListFlightComponent;
  let fixture: ComponentFixture<NoticeListFlightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoticeListFlightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticeListFlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
