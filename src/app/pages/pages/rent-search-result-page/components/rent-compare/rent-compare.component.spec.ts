/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RentCompareComponent } from './rent-compare.component';

describe('RentCompareComponent', () => {
  let component: RentCompareComponent;
  let fixture: ComponentFixture<RentCompareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RentCompareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RentCompareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
