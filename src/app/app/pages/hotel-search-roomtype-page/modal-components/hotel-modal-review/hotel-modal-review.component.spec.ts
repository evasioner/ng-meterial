import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelModalReviewComponent } from './hotel-modal-review.component';

describe('HotelModalReviewComponent', () => {
  let component: HotelModalReviewComponent;
  let fixture: ComponentFixture<HotelModalReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelModalReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelModalReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
