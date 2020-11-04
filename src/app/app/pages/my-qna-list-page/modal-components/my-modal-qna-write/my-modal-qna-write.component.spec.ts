import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyModalQnaWriteComponent } from './my-modal-qna-write.component';

describe('MyModalQnaWriteComponent', () => {
  let component: MyModalQnaWriteComponent;
  let fixture: ComponentFixture<MyModalQnaWriteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyModalQnaWriteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyModalQnaWriteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
