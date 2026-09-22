import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DesignView } from './design-view';

describe('DesignView', () => {
  let component: DesignView;
  let fixture: ComponentFixture<DesignView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesignView],
    }).compileComponents();

    fixture = TestBed.createComponent(DesignView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
