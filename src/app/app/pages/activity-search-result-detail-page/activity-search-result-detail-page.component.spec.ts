import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitySearchResultDetailPageComponent } from './activity-search-result-detail-page.component';

describe('ActivitySearchResultDetailPageComponent', () => {
  let component: ActivitySearchResultDetailPageComponent;
  let fixture: ComponentFixture<ActivitySearchResultDetailPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivitySearchResultDetailPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivitySearchResultDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
