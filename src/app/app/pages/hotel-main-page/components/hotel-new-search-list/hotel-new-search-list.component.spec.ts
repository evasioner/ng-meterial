import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelNewSearchListComponent } from './hotel-new-search-list.component';

describe('HotelNewSearchListComponent', () => {
  let component: HotelNewSearchListComponent;
  let fixture: ComponentFixture<HotelNewSearchListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelNewSearchListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelNewSearchListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
