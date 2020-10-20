import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RentMainSearchComponent } from './rent-main-search.component';

describe('RentMainSearchComponent', () => {
  let component: RentMainSearchComponent;
  let fixture: ComponentFixture<RentMainSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RentMainSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RentMainSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
