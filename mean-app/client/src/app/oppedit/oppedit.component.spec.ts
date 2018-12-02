import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OppeditComponent } from './oppedit.component';

describe('OppeditComponent', () => {
  let component: OppeditComponent;
  let fixture: ComponentFixture<OppeditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OppeditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OppeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
