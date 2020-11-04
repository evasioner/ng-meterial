import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryStringComponent } from './query-string.component';

describe('QueryStringComponent', () => {
  let component: QueryStringComponent;
  let fixture: ComponentFixture<QueryStringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueryStringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryStringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
