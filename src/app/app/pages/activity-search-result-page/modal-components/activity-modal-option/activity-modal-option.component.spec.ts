import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityModalOptionComponent } from './activity-modal-option.component';

describe('ActivityModalOptionComponent', () => {
  let component: ActivityModalOptionComponent;
  let fixture: ComponentFixture<ActivityModalOptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityModalOptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityModalOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
