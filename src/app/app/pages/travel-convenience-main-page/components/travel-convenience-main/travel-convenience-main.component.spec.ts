import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelConvenienceMainComponent } from './travel-convenience-main.component';

describe('TravelConvenienceMainComponent', () => {
  let component: TravelConvenienceMainComponent;
  let fixture: ComponentFixture<TravelConvenienceMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TravelConvenienceMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TravelConvenienceMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
