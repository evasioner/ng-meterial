import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RentGuideBtnComponent } from './rent-guide-btn.component';

describe('RentGuideBtnComponent', () => {
  let component: RentGuideBtnComponent;
  let fixture: ComponentFixture<RentGuideBtnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RentGuideBtnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RentGuideBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
