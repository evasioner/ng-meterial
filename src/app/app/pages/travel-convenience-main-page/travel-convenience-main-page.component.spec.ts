import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelConvenienceMainPageComponent } from './travel-convenience-main-page.component';

describe('TravelConvenienceMainPageComponent', () => {
  let component: TravelConvenienceMainPageComponent;
  let fixture: ComponentFixture<TravelConvenienceMainPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TravelConvenienceMainPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TravelConvenienceMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
