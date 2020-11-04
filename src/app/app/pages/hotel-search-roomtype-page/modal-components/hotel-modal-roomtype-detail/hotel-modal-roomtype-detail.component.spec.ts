import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelModalRoomtypeDetailComponent } from './hotel-modal-roomtype-detail.component';

describe('HotelModalRoomtypeDetailComponent', () => {
  let component: HotelModalRoomtypeDetailComponent;
  let fixture: ComponentFixture<HotelModalRoomtypeDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelModalRoomtypeDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelModalRoomtypeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
