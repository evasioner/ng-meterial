/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MyModalReviewWriteCompleteComponent } from './my-modal-review-write-complete.component';

describe('MyModalReviewWriteCompleteComponent', () => {
  let component: MyModalReviewWriteCompleteComponent;
  let fixture: ComponentFixture<MyModalReviewWriteCompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyModalReviewWriteCompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyModalReviewWriteCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
