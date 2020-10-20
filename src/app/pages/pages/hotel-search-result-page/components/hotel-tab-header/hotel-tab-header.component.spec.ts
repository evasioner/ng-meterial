import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelTabHeaderComponent } from './hotel-tab-header.component';

describe('HotelTabHeaderComponent', () => {
  let component: HotelTabHeaderComponent;
  let fixture: ComponentFixture<HotelTabHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelTabHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelTabHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
