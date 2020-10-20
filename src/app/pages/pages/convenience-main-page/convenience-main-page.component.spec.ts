import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvenienceMainPageComponent } from './convenience-main-page.component';

describe('ConvenienceMainPageComponent', () => {
  let component: ConvenienceMainPageComponent;
  let fixture: ComponentFixture<ConvenienceMainPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConvenienceMainPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConvenienceMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
