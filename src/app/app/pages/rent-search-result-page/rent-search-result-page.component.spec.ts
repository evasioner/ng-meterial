import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RentSearchResultPageComponent } from './rent-search-result-page.component';

describe('RentSearchResultPageComponent', () => {
  let component: RentSearchResultPageComponent;
  let fixture: ComponentFixture<RentSearchResultPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RentSearchResultPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RentSearchResultPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
