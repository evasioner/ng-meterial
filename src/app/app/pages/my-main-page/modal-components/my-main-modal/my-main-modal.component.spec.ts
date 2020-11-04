import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyMainModalComponent } from './my-main-modal.component';

describe('MyMainModalComponent', () => {
  let component: MyMainModalComponent;
  let fixture: ComponentFixture<MyMainModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyMainModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyMainModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
