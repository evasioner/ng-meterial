import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyQnaListPageComponent } from './my-qna-list-page.component';

describe('MyQnaListPageComponent', () => {
  let component: MyQnaListPageComponent;
  let fixture: ComponentFixture<MyQnaListPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyQnaListPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyQnaListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
