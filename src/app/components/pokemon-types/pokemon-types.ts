import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonRequest } from '../../services/pokemon-request';
import { PokemonList } from '../pokemon-list/pokemon-list';
import { PokemonTypeButton } from "../pokemon-type-button/pokemon-type-button";

@Component({
  selector: 'app-pokemon-types',
  imports: [CommonModule, PokemonList, PokemonTypeButton],
  templateUrl: './pokemon-types.html',
  styleUrl: './pokemon-types.css',
  providers:[PokemonRequest]
})
export class PokemonTypes {
  pokemonTypes: Type[] = [];
  loading = false;
  pokemonService = inject(PokemonRequest)
  typeSelected!:Type

  constructor() {}

  ngOnInit(): void {
    this.fetchTypes();
  }

  fetchTypes(): void {
    this.loading = true;
    this.pokemonService.getPokemonTypes().subscribe((data: {results:Type[]}) => {
      this.pokemonTypes = data.results;
      this.loading = false;
      this.typeSelected=this.pokemonTypes[0]
    });
  }

  selectType(type: Type) {
    this.typeSelected=type
  }
}
