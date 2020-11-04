import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyModalHotelBookerModifyComponent } from './my-modal-hotel-booker-modify.component';

describe('MyModalHotelBookerModifyComponent', () => {
  let component: MyModalHotelBookerModifyComponent;
  let fixture: ComponentFixture<MyModalHotelBookerModifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyModalHotelBookerModifyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyModalHotelBookerModifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
