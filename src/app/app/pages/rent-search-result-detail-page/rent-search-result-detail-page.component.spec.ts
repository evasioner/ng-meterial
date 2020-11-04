import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RentSearchResultDetailPageComponent } from './rent-search-result-detail-page.component';

describe('RentSearchResultDetailPageComponent', () => {
  let component: RentSearchResultDetailPageComponent;
  let fixture: ComponentFixture<RentSearchResultDetailPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RentSearchResultDetailPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RentSearchResultDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
