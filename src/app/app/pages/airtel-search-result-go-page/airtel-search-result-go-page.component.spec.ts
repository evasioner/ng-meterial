import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AirtelSearchResultGoPageComponent } from './airtel-search-result-go-page.component';

describe('AirtelSearchResultGoPageComponent', () => {
  let component: AirtelSearchResultGoPageComponent;
  let fixture: ComponentFixture<AirtelSearchResultGoPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AirtelSearchResultGoPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirtelSearchResultGoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
