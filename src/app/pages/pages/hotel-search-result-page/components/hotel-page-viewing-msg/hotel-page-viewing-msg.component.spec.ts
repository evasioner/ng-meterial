import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelPageViewingMsgComponent } from './hotel-page-viewing-msg.component';

describe('HotelPageViewingMsgComponent', () => {
  let component: HotelPageViewingMsgComponent;
  let fixture: ComponentFixture<HotelPageViewingMsgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelPageViewingMsgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelPageViewingMsgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
