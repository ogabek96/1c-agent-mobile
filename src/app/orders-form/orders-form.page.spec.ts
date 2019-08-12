import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersFormPage } from './orders-form.page';

describe('OrdersFormPage', () => {
  let component: OrdersFormPage;
  let fixture: ComponentFixture<OrdersFormPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdersFormPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
