import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityModalProductQnaComponent } from './activity-modal-product-qna.component';

describe('ActivityModalProductQnaComponent', () => {
  let component: ActivityModalProductQnaComponent;
  let fixture: ComponentFixture<ActivityModalProductQnaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityModalProductQnaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityModalProductQnaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
