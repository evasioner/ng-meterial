import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RentHeaderComponent } from './rent-header.component';

describe('RentHeaderComponent', () => {
  let component: RentHeaderComponent;
  let fixture: ComponentFixture<RentHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RentHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RentHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
