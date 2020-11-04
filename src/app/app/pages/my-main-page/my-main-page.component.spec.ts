import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyMainPageComponent } from './my-main-page.component';

describe('MyMainPageComponent', () => {
  let component: MyMainPageComponent;
  let fixture: ComponentFixture<MyMainPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyMainPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
