import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationQnaComponent } from './reservation-qna.component';

describe('ReservationQnaComponent', () => {
  let component: ReservationQnaComponent;
  let fixture: ComponentFixture<ReservationQnaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReservationQnaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservationQnaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
