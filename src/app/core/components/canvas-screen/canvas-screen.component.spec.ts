import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasScreenComponent } from './canvas-screen.component';

describe('CanvasScreenComponent', () => {
  let component: CanvasScreenComponent;
  let fixture: ComponentFixture<CanvasScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CanvasScreenComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CanvasScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
