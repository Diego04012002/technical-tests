import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonMove } from './pokemon-move';

describe('PokemonMove', () => {
  let component: PokemonMove;
  let fixture: ComponentFixture<PokemonMove>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonMove]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokemonMove);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
