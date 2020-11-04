import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyModalReservationQnaWriteComponent } from './my-modal-reservation-qna-write.component';

describe('MyModalReservationQnaWriteComponent', () => {
  let component: MyModalReservationQnaWriteComponent;
  let fixture: ComponentFixture<MyModalReservationQnaWriteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyModalReservationQnaWriteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyModalReservationQnaWriteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
