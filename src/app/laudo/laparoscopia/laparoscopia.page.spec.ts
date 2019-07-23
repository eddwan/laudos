import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaparoscopiaPage } from './laparoscopia.page';

describe('LaparoscopiaPage', () => {
  let component: LaparoscopiaPage;
  let fixture: ComponentFixture<LaparoscopiaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaparoscopiaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaparoscopiaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
