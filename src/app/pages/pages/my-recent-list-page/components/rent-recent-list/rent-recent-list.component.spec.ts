import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RentRecentListComponent } from './rent-recent-list.component';

describe('RentRecentListComponent', () => {
  let component: RentRecentListComponent;
  let fixture: ComponentFixture<RentRecentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RentRecentListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RentRecentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
