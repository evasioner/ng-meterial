import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyRecentListPageComponent } from './my-recent-list-page.component';

describe('MyRecentListPageComponent', () => {
  let component: MyRecentListPageComponent;
  let fixture: ComponentFixture<MyRecentListPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyRecentListPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyRecentListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
