import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityModalDetailFilterComponent } from './activity-modal-detail-filter.component';

describe('ActivityModalDetailFilterComponent', () => {
  let component: ActivityModalDetailFilterComponent;
  let fixture: ComponentFixture<ActivityModalDetailFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityModalDetailFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityModalDetailFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
