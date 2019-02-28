import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DebteditComponent } from './debtedit.component';

describe('DebteditComponent', () => {
  let component: DebteditComponent;
  let fixture: ComponentFixture<DebteditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DebteditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DebteditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
