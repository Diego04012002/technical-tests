import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-pokemon-type-button',
  imports: [],
  templateUrl: './pokemon-type-button.html',
  styleUrl: './pokemon-type-button.css',
})
export class PokemonTypeButton implements OnInit {
  @Output() seletectType = new EventEmitter<Type>();

  @Input() typeSelected!: Type;
  @Input() isButton: boolean = true;
  @Input() isSelected:boolean=false

  constructor() {}

  ngOnInit(): void {}

  selectType(type: any) {
    if (this.isButton) {
      this.seletectType.emit(type);
    }
  }
}
