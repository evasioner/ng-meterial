import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyModalReservationQnaViewComponent } from './my-modal-reservation-qna-view.component';

describe('MyModalReservationQnaViewComponent', () => {
  let component: MyModalReservationQnaViewComponent;
  let fixture: ComponentFixture<MyModalReservationQnaViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyModalReservationQnaViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyModalReservationQnaViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
