import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AirtelSearchResultComePageComponent } from './airtel-search-result-come-page.component';

describe('AirtelSearchResultComePageComponent', () => {
  let component: AirtelSearchResultComePageComponent;
  let fixture: ComponentFixture<AirtelSearchResultComePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AirtelSearchResultComePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirtelSearchResultComePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
