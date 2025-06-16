import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonInfo } from './pokemon-info';

describe('PokemonInfo', () => {
  let component: PokemonInfo;
  let fixture: ComponentFixture<PokemonInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonInfo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokemonInfo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
