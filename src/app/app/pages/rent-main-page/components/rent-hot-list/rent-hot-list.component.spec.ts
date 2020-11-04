import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RentHotListComponent } from './rent-hot-list.component';

describe('RentHotListComponent', () => {
  let component: RentHotListComponent;
  let fixture: ComponentFixture<RentHotListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RentHotListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RentHotListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
