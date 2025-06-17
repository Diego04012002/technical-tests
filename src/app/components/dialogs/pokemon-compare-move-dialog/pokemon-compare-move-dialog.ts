import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PokemonRequest } from '../../../services/pokemon-request';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AsyncPipe } from '@angular/common';
import { map, Observable, startWith } from 'rxjs';
import { PokemonMove } from "../../pokemon-move/pokemon-move";
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-pokemon-compare-move-dialog',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
    PokemonMove,
    MatIconModule
],
  templateUrl: './pokemon-compare-move-dialog.html',
  styleUrl: './pokemon-compare-move-dialog.css',
})
export class PokemonCompareMoveDialog implements OnInit {
  readonly dialogRef = inject(MatDialogRef<PokemonCompareMoveDialog>);
  pokemonService = inject(PokemonRequest);
  listFristMove!: Observable<any[]>;
  listSecondMove!: Observable<any[]>;
  listFristMoveOptions!: any[];
  listSecondMoveOptions!: any[];
  firstMove!:{name:string; url:string}
  secondMove!:{name:string; url:string}
  firstMoveName = new FormControl('');
  secondMoveName = new FormControl('');
  showMoveCompare:boolean=false

  constructor() {}

  ngOnInit(): void {
    this.fetchMoves();
  }

  fetchMoves() {
    this.pokemonService.getPokemonMoves().subscribe((data: any) => {
      this.listFristMoveOptions = data.results;
      this.listSecondMoveOptions = data.results;

      this.firstMoveName.valueChanges.pipe(startWith('')).subscribe(() => {
        this.listSecondMove = this.secondMoveName.valueChanges.pipe(
          startWith(''),
          map((move) => this.filterSecondMove(move || ''))
        );
      });

      this.secondMoveName.valueChanges.pipe(startWith('')).subscribe(() => {
        this.listFristMove = this.firstMoveName.valueChanges.pipe(
          startWith(''),
          map((move) => this.filterFirtsMove(move || ''))
        );
      });

      this.listFristMove = this.firstMoveName.valueChanges.pipe(
        startWith(''),
        map((move) => this.filterFirtsMove(move || ''))
      );
      this.listSecondMove = this.secondMoveName.valueChanges.pipe(
        startWith(''),
        map((move) => this.filterSecondMove(move || ''))
      );
    });
  }

  private filterFirtsMove(value: string): any[] {
    const filterValue = value.toLowerCase();
    const selectedSecond = this.secondMoveName.value;
    return this.listFristMoveOptions
      .filter((move) => move.name !== selectedSecond)
      .filter((move) => move.name.toLowerCase().includes(filterValue));
  }

  private filterSecondMove(value: string): any[] {
    const filterValue = value.toLowerCase();
    const selectedFirst = this.firstMoveName.value;
    return this.listSecondMoveOptions
      .filter((move) => move.name !== selectedFirst)
      .filter((move) => move.name.toLowerCase().includes(filterValue));
  }

  showMoveCompareStats(){
    if(!this.showMoveCompare){
      this.showMoveCompare=true
    }
    this.firstMove= this.listFristMoveOptions.find(move=>move.name==this.firstMoveName.value)
    this.secondMove= this.listSecondMoveOptions.find(move=>move.name==this.secondMoveName.value)
  }

  close(){
    this.dialogRef.close()
  }
}
