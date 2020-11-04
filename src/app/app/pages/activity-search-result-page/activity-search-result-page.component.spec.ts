import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitySearchResultPageComponent } from './activity-search-result-page.component';

describe('ActivitySearchResultPageComponent', () => {
  let component: ActivitySearchResultPageComponent;
  let fixture: ComponentFixture<ActivitySearchResultPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivitySearchResultPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivitySearchResultPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
