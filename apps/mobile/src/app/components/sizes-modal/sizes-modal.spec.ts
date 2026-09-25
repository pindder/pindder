import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SizesModal } from './sizes-modal';

describe('SizesModal', () => {
  let component: SizesModal;
  let fixture: ComponentFixture<SizesModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SizesModal],
    }).compileComponents();

    fixture = TestBed.createComponent(SizesModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
