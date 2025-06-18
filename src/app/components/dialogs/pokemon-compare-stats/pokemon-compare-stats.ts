import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PokemonRequest } from '../../../services/pokemon-request';
import { PokemonInfo } from '../../pokemon-info/pokemon-info';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-pokemon-compare-stats',
  imports: [PokemonInfo, MatIconModule],
  templateUrl: './pokemon-compare-stats.html',
  styleUrl: './pokemon-compare-stats.css'
})
export class PokemonCompareStats implements OnInit{

  readonly dialogRef = inject(MatDialogRef<PokemonCompareStats>);
  readonly pokemonToCompare = inject<Pokemon[]>(MAT_DIALOG_DATA);
  pokemonService = inject(PokemonRequest);

  constructor(){

  }

  ngOnInit(): void {
  }

  close(){
    this.dialogRef.close()
  }

}
