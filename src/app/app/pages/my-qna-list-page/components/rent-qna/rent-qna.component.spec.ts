import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RentQnaComponent } from './rent-qna.component';

describe('RentQnaComponent', () => {
  let component: RentQnaComponent;
  let fixture: ComponentFixture<RentQnaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RentQnaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RentQnaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
