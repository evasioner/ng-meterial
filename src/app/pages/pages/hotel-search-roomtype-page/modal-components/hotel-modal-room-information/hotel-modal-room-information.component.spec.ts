import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelModalRoomInformationComponent } from './hotel-modal-room-information.component';

describe('HotelModalRoomInformationComponent', () => {
  let component: HotelModalRoomInformationComponent;
  let fixture: ComponentFixture<HotelModalRoomInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelModalRoomInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelModalRoomInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
