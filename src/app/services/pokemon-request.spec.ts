import { TestBed } from '@angular/core/testing';

import { PokemonRequest } from './pokemon-request';

describe('PokemonRequest', () => {
  let service: PokemonRequest;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PokemonRequest);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
