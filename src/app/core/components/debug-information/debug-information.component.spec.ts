import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebugInformationComponent } from './debug-information.component';

describe('DebugInformationComponent', () => {
  let component: DebugInformationComponent;
  let fixture: ComponentFixture<DebugInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DebugInformationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DebugInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
