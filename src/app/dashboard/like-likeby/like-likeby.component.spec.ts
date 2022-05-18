import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LikeLikebyComponent } from './like-likeby.component';

describe('LikeLikebyComponent', () => {
  let component: LikeLikebyComponent;
  let fixture: ComponentFixture<LikeLikebyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LikeLikebyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LikeLikebyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
