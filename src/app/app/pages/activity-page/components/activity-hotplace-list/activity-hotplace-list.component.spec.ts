import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityHotplaceListComponent } from './activity-hotplace-list.component';

describe('ActivityHotplaceListComponent', () => {
  let component: ActivityHotplaceListComponent;
  let fixture: ComponentFixture<ActivityHotplaceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityHotplaceListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityHotplaceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
