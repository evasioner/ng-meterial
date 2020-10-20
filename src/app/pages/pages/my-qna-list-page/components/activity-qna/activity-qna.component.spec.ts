import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityQnaComponent } from './activity-qna.component';

describe('ActivityQnaComponent', () => {
  let component: ActivityQnaComponent;
  let fixture: ComponentFixture<ActivityQnaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityQnaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityQnaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
