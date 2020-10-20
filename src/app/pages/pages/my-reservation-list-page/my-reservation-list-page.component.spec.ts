import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyReservationListPageComponent } from './my-reservation-list-page.component';

describe('MyReservationListPageComponent', () => {
  let component: MyReservationListPageComponent;
  let fixture: ComponentFixture<MyReservationListPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyReservationListPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyReservationListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
