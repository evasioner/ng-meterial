import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelBreadcrumbsComponent } from './hotel-breadcrumbs.component';

describe('HotelBreadcrumbsComponent', () => {
  let component: HotelBreadcrumbsComponent;
  let fixture: ComponentFixture<HotelBreadcrumbsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelBreadcrumbsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelBreadcrumbsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
