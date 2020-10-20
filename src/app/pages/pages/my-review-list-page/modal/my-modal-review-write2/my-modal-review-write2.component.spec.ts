/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MyModalReviewWrite2Component } from './my-modal-review-write2.component';

describe('MyModalReviewWrite2Component', () => {
  let component: MyModalReviewWrite2Component;
  let fixture: ComponentFixture<MyModalReviewWrite2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyModalReviewWrite2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyModalReviewWrite2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
