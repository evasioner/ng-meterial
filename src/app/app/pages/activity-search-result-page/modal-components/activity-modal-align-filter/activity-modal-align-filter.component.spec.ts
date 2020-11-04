import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityModalAlignFilterComponent } from './activity-modal-align-filter.component';

describe('ActivityModalAlignFilterComponent', () => {
  let component: ActivityModalAlignFilterComponent;
  let fixture: ComponentFixture<ActivityModalAlignFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityModalAlignFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityModalAlignFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
