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
  listFristMove!: Observable<Move[]>;
  listSecondMove!: Observable<Move[]>;
  listFristMoveOptions!: Move[];
  listSecondMoveOptions!: Move[];
  firstMove!:Move
  secondMove!:Move
  firstMoveName = new FormControl('');
  secondMoveName = new FormControl('');
  showMoveCompare:boolean=false

  constructor() {}

  ngOnInit(): void {
    this.fetchMoves();
  }

  fetchMoves() {
    this.pokemonService.getPokemonMoves().subscribe((data: any) => {
      this.listFristMoveOptions = data.results as Move[];
      this.listSecondMoveOptions = data.results as Move[];

      this.firstMoveName.valueChanges.pipe(startWith('')).subscribe(() => {
        this.listSecondMove = this.secondMoveName.valueChanges.pipe(
          startWith(''),
          map((move:string | null) => this.filterMoves(move || '', this.listFristMoveOptions, this.firstMoveName))
        );
      });

      this.secondMoveName.valueChanges.pipe(startWith('')).subscribe(() => {
        this.listFristMove = this.firstMoveName.valueChanges.pipe(
          startWith(''),
          map((move:string | null) => this.filterMoves(move || '', this.listSecondMoveOptions, this.secondMoveName))
        );
      });

      this.listFristMove = this.firstMoveName.valueChanges.pipe(
        startWith(''),
        map((move:string | null) => this.filterMoves(move || '', this.listFristMoveOptions, this.firstMoveName))
      );
      this.listSecondMove = this.secondMoveName.valueChanges.pipe(
        startWith(''),
        map((move:string | null) => this.filterMoves(move || '', this.listSecondMoveOptions, this.secondMoveName))
      );
    });
  }


  filterMoves(value:string, listToFilter:Move[], moveToQuit:FormControl):Move[]{
    const filterValue = value.toLowerCase();
    const selectedSecond = moveToQuit.value;
    return listToFilter
      .filter((move:Move) => move.name !== selectedSecond)
      .filter((move:Move) => move.name.toLowerCase().includes(filterValue));
  }

  showMoveCompareStats(){
    if(!this.showMoveCompare){
      this.showMoveCompare=true
    }
    this.firstMove = this.listFristMoveOptions.find((move:Move) => move.name == this.firstMoveName.value)!;
    this.secondMove= this.listSecondMoveOptions.find((move:Move)=>move.name==this.secondMoveName.value)!
  }

  close(){
    this.dialogRef.close()
  }
}
