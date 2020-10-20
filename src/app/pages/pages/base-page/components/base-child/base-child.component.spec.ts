import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseChildComponent } from './base-child.component';

describe('BaseChildComponent', () => {
  let component: BaseChildComponent;
  let fixture: ComponentFixture<BaseChildComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseChildComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseChildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
