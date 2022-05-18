import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogInnerComponent } from './blog-inner.component';

describe('BlogInnerComponent', () => {
  let component: BlogInnerComponent;
  let fixture: ComponentFixture<BlogInnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlogInnerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogInnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
