import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AirtelMainSearchComponent } from './airtel-main-search.component';

describe('AirtelMainSearchComponent', () => {
  let component: AirtelMainSearchComponent;
  let fixture: ComponentFixture<AirtelMainSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AirtelMainSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirtelMainSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
