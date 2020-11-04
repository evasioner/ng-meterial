import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelModalDetailOptionComponent } from './hotel-modal-detail-option.component';

describe('HotelModalDetailOptionComponent', () => {
  let component: HotelModalDetailOptionComponent;
  let fixture: ComponentFixture<HotelModalDetailOptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelModalDetailOptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelModalDetailOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
