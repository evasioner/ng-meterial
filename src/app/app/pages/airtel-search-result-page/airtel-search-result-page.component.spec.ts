import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AirtelSearchResultPageComponent } from './airtel-search-result-page.component';

describe('AirtelSearchResultPageComponent', () => {
  let component: AirtelSearchResultPageComponent;
  let fixture: ComponentFixture<AirtelSearchResultPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AirtelSearchResultPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirtelSearchResultPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
