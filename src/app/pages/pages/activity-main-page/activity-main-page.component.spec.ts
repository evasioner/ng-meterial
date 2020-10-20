import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityMainPageComponent } from './activity-main-page.component';

describe('ActivityMainPageComponent', () => {
  let component: ActivityMainPageComponent;
  let fixture: ComponentFixture<ActivityMainPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityMainPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
