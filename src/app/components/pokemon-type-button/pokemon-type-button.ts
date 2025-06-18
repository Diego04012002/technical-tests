import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-pokemon-type-button',
  imports: [],
  templateUrl: './pokemon-type-button.html',
  styleUrl: './pokemon-type-button.css',
})
export class PokemonTypeButton implements OnInit, OnChanges {
  @Output() seletectType = new EventEmitter<Type>();

  @Input() typeSelected!: Type;
  @Input() isButton: boolean = true;
  @Input() isSelected:boolean=false

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['isSelected']){
      console.log(this.isSelected)
    }
  }

  selectType(type: Type) {
    if (this.isButton) {
      this.seletectType.emit(type);
    }
  }
}
