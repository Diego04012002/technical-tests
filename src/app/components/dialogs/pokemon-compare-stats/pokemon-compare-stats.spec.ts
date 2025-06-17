import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonCompareStats } from './pokemon-compare-stats';

describe('PokemonCompareStats', () => {
  let component: PokemonCompareStats;
  let fixture: ComponentFixture<PokemonCompareStats>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonCompareStats]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokemonCompareStats);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
