import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelConvenienceHeaderComponent } from './travel-convenience-header.component';

describe('TravelConvenienceHeaderComponent', () => {
  let component: TravelConvenienceHeaderComponent;
  let fixture: ComponentFixture<TravelConvenienceHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TravelConvenienceHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TravelConvenienceHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
