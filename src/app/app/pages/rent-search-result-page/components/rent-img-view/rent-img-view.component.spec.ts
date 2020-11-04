import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RentImgViewComponent } from './rent-img-view.component';

describe('RentImgViewComponent', () => {
  let component: RentImgViewComponent;
  let fixture: ComponentFixture<RentImgViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RentImgViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RentImgViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
