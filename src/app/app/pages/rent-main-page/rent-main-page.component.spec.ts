import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RentMainPageComponent } from './rent-page.component';

describe('RentPageComponent', () => {
  let component: RentMainPageComponent;
  let fixture: ComponentFixture<RentMainPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RentMainPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RentMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});