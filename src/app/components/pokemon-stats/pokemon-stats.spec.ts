import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonStats } from './pokemon-stats';

describe('PokemonStats', () => {
  let component: PokemonStats;
  let fixture: ComponentFixture<PokemonStats>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonStats]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokemonStats);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
