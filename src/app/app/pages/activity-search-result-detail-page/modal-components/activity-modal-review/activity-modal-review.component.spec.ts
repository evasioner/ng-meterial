import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityModalReviewComponent } from './activity-modal-review.component';

describe('ActivityModalReviewComponent', () => {
  let component: ActivityModalReviewComponent;
  let fixture: ComponentFixture<ActivityModalReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityModalReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityModalReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
