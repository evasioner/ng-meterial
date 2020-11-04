import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityMainSearchComponent } from './activity-main-search.component';

describe('ActivityMainSearchComponent', () => {
  let component: ActivityMainSearchComponent;
  let fixture: ComponentFixture<ActivityMainSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityMainSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityMainSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
