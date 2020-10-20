import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelCompareComponent } from './hotel-compare.component';

describe('HotelCompareComponent', () => {
  let component: HotelCompareComponent;
  let fixture: ComponentFixture<HotelCompareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelCompareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelCompareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
