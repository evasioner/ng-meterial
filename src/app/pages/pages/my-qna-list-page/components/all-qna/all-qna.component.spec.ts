import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllQnaComponent } from './all-qna.component';

describe('AllQnaComponent', () => {
  let component: AllQnaComponent;
  let fixture: ComponentFixture<AllQnaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllQnaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllQnaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
