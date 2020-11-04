import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelHeaderComponent } from './hotel-header.component';

describe('HotelHeaderComponent', () => {
  let component: HotelHeaderComponent;
  let fixture: ComponentFixture<HotelHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
