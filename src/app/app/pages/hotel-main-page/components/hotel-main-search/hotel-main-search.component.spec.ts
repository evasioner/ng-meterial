import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelMainSearchComponent } from './hotel-main-search.component';

describe('HotelMainSearchComponent', () => {
  let component: HotelMainSearchComponent;
  let fixture: ComponentFixture<HotelMainSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelMainSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelMainSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
