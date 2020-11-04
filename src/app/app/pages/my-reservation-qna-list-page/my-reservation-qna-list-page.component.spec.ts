import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyReservationQnaListPageComponent } from './my-reservation-qna-list-page.component';

describe('MyReservationQnaListPageComponent', () => {
  let component: MyReservationQnaListPageComponent;
  let fixture: ComponentFixture<MyReservationQnaListPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyReservationQnaListPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyReservationQnaListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
