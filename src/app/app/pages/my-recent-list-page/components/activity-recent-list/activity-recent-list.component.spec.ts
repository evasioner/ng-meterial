import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityRecentListComponent } from './activity-recent-list.component';

describe('ActivityRecentListComponent', () => {
  let component: ActivityRecentListComponent;
  let fixture: ComponentFixture<ActivityRecentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityRecentListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityRecentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
