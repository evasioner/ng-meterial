import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelSearchRoomtypePageComponent } from './hotel-search-roomtype-page.component';

describe('HotelSearchRoomtypePageComponent', () => {
  let component: HotelSearchRoomtypePageComponent;
  let fixture: ComponentFixture<HotelSearchRoomtypePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelSearchRoomtypePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelSearchRoomtypePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
