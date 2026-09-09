import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataTile } from './data-tile';

describe('DataTile', () => {
  let component: DataTile;
  let fixture: ComponentFixture<DataTile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataTile],
    }).compileComponents();

    fixture = TestBed.createComponent(DataTile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
