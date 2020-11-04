import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DateSearchComponent } from './date-search.component';

describe('DateSearchComponent', () => {
  let component: DateSearchComponent;
  let fixture: ComponentFixture<DateSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DateSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
