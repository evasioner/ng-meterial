import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelConvenienceUsimListComponent } from './travel-convenience-usim-list.component';

describe('TravelConvenienceUsimListComponent', () => {
  let component: TravelConvenienceUsimListComponent;
  let fixture: ComponentFixture<TravelConvenienceUsimListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TravelConvenienceUsimListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TravelConvenienceUsimListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
