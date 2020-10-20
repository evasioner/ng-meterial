import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelTabBodyComponent } from './hotel-tab-body.component';

describe('HotelTabBodyComponent', () => {
  let component: HotelTabBodyComponent;
  let fixture: ComponentFixture<HotelTabBodyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelTabBodyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelTabBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
