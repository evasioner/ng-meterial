import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RentNewSearchListComponent } from './rent-new-search-list.component';

describe('RentNewSearchListComponent', () => {
  let component: RentNewSearchListComponent;
  let fixture: ComponentFixture<RentNewSearchListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RentNewSearchListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RentNewSearchListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
