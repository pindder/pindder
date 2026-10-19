import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchCountries } from './search-countries';

describe('SearchCountries', () => {
  let component: SearchCountries;
  let fixture: ComponentFixture<SearchCountries>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchCountries],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchCountries);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
