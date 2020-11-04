import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxPipesComponent } from './ngx-pipes.component';

describe('NgxPipesComponent', () => {
  let component: NgxPipesComponent;
  let fixture: ComponentFixture<NgxPipesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxPipesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxPipesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
