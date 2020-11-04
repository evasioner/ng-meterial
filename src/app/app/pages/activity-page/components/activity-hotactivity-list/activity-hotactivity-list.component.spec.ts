import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityHotactivityListComponent } from './activity-hotactivity-list.component';

describe('ActivityHotactivityListComponent', () => {
  let component: ActivityHotactivityListComponent;
  let fixture: ComponentFixture<ActivityHotactivityListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityHotactivityListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityHotactivityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
