import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyReservationActivityDetailPageComponent } from './my-reservation-activity-detail-page.component';

describe('MyReservationActivityDetailPageComponent', () => {
  let component: MyReservationActivityDetailPageComponent;
  let fixture: ComponentFixture<MyReservationActivityDetailPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyReservationActivityDetailPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyReservationActivityDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
