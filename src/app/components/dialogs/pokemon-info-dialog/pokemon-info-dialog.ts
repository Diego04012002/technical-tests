import { Component, inject, model, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { PokemonStats } from '../../pokemon-stats/pokemon-stats';
import { PokemonInfo } from '../../pokemon-info/pokemon-info';
import { PokemonRequest } from '../../../services/pokemon-request';
import { PokemonTypeButton } from '../../pokemon-type-button/pokemon-type-button';
import { PokemonList } from '../../pokemon-list/pokemon-list';

@Component({
  standalone: true,
  selector: 'app-pokemon-info-dialog',
  imports: [MatIconModule, MatListModule, PokemonInfo, PokemonTypeButton],
  templateUrl: './pokemon-info-dialog.html',
  styleUrl: './pokemon-info-dialog.css',
})
export class PokemonInfoDialog implements OnInit {
  readonly dialogRef = inject(MatDialogRef<PokemonInfoDialog>);
  readonly data = inject<Pokemon>(MAT_DIALOG_DATA);
  pokemonService = inject(PokemonRequest);
  pokemon = this.data;
  pokemonEvo: any;
  listPokemonByTpe: any;
  showEvolution: boolean = false;
  showListByType: boolean = false;
  noHaveEvolution: boolean = false;
  loadingEvolution: boolean = false;

  constructor() {}

  ngOnInit(): void {
  }

  close() {
    this.dialogRef.close();
  }

  showEvolutionDetail() {
    if (this.pokemonEvo && this.showEvolution) {
      this.loadingEvolution = false;
      this.showEvolution = false;
      this.showListByType = false;
      this.noHaveEvolution=false
      return;
    }
    if (this.showEvolution) {
      this.showEvolution = false;
      return;
    }
    if(this.noHaveEvolution){
      this.noHaveEvolution=false
      return;
    }
    this.loadingEvolution = true;

    this.pokemonService.getPokemonSpecie(this.pokemon.species.url).subscribe({
      next: (data: any) => {
        const urlEvolutionChain = data.evolution_chain.url;
        this.pokemonService.getPokemonDetails(urlEvolutionChain).subscribe({
          next: (dataEvo: Evolution) => {
            const chain = dataEvo.chain;
            const nextEvolution = this.findNextEvolution(chain, this.pokemon.name);
            if (nextEvolution) {
              const evolutionId = this.extractIdFromUrl(nextEvolution.species.url);
              this.pokemonService.getPokemonDetailById(evolutionId).subscribe({
                next: (evolutionData: any) => {
                  this.pokemonEvo = evolutionData;
                  this.loadingEvolution = false;
                  this.showEvolution = true;
                  this.showListByType = false;
                }
              });
            } else {
              this.loadingEvolution = false;
              this.noHaveEvolution = true;
            }
          }
        });
      }
    });
  }

  findNextEvolution(chain: EvolutionChain, currentPokemonName: string): any | null {
    if (
      chain.species.name === currentPokemonName &&
      chain.evolves_to.length > 0
    ) {
      return chain.evolves_to[0];
    }

    if (
      chain.evolves_to.length > 0 &&
      chain.evolves_to[0].species.name === currentPokemonName
    ) {
      if (chain.evolves_to[0].evolves_to.length > 0) {
        return chain.evolves_to[0].evolves_to[0];
      }
    }

    return null;
  }

  extractIdFromUrl(url: string): string {
    const urlSplit = url.split('/');
    return urlSplit[6];
  }

  showListPokemonByType(type: Type) {
    let info = {
      typeOption: type,
      pokemon: this.pokemon,
    };
    this.dialogRef.close(info);
  }
}
