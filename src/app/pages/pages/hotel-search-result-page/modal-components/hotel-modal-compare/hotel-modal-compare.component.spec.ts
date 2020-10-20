import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelModalCompareComponent } from './hotel-modal-compare.component';

describe('HotelModalCompareComponent', () => {
  let component: HotelModalCompareComponent;
  let fixture: ComponentFixture<HotelModalCompareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelModalCompareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelModalCompareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
