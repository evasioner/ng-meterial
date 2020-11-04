import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyModalQnaViewComponent } from './my-modal-qna-view.component';

describe('MyModalQnaViewComponent', () => {
  let component: MyModalQnaViewComponent;
  let fixture: ComponentFixture<MyModalQnaViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyModalQnaViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyModalQnaViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
