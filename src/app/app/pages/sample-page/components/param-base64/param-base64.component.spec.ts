import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParamBase64Component } from './param-base64.component';

describe('ParamBase64Component', () => {
  let component: ParamBase64Component;
  let fixture: ComponentFixture<ParamBase64Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParamBase64Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParamBase64Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
