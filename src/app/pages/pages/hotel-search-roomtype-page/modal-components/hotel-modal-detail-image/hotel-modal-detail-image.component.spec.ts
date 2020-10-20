import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelModalDetailImageComponent } from './hotel-modal-detail-image.component';

describe('HotelModalDetailImageComponent', () => {
  let component: HotelModalDetailImageComponent;
  let fixture: ComponentFixture<HotelModalDetailImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelModalDetailImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelModalDetailImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
