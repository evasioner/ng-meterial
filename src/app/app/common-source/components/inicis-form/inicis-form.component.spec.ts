/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { InicisFormComponent } from './inicis-form.component';

describe('InicisFormComponent', () => {
  let component: InicisFormComponent;
  let fixture: ComponentFixture<InicisFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InicisFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InicisFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
