import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AirtelSearchRoomtypePageComponent } from './airtel-search-roomtype-page.component';

describe('AirtelSearchRoomtypePageComponent', () => {
  let component: AirtelSearchRoomtypePageComponent;
  let fixture: ComponentFixture<AirtelSearchRoomtypePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AirtelSearchRoomtypePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirtelSearchRoomtypePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
