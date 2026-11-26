import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewStyle } from './view-style';

describe('ViewStyle', () => {
  let component: ViewStyle;
  let fixture: ComponentFixture<ViewStyle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewStyle],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewStyle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
