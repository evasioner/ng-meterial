import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyReviewListPageComponent } from './my-review-list-page.component';

describe('MyReviewListPageComponent', () => {
  let component: MyReviewListPageComponent;
  let fixture: ComponentFixture<MyReviewListPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyReviewListPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyReviewListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
