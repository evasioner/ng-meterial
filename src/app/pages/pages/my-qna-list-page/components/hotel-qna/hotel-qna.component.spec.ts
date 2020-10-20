import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelQnaComponent } from './hotel-qna.component';

describe('HotelQnaComponent', () => {
  let component: HotelQnaComponent;
  let fixture: ComponentFixture<HotelQnaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelQnaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelQnaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
