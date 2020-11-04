import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyMainContentsComponent } from './my-main-contents.component';

describe('MyMainContentsComponent', () => {
  let component: MyMainContentsComponent;
  let fixture: ComponentFixture<MyMainContentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyMainContentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyMainContentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
