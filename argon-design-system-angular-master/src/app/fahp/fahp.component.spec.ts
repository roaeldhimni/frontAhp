import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FahpComponent } from './fahp.component';

describe('FahpComponent', () => {
  let component: FahpComponent;
  let fixture: ComponentFixture<FahpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FahpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FahpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
