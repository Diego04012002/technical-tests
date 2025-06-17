import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { PokemonStats } from '../pokemon-stats/pokemon-stats';

@Component({
  selector: 'app-pokemon-info',
  imports: [PokemonStats],
  templateUrl: './pokemon-info.html',
  styleUrl: './pokemon-info.css'
})
export class PokemonInfo implements OnChanges{

  @Input() pokemon:any
  @Input() isCompare:boolean=false

  constructor(){

  }

  ngOnChanges(changes: SimpleChanges): void {
    // if(changes['pokemon'] && changes['pokemon'].currentValue){
    //   this.pokemon=this.pokemon
    // }
  }

  getStatsObject(){
    let stats=this.pokemon.stats.map((data:any)=>{
      return {
        name: data.stat.name.toUpperCase(),
        value:data.base_stat
      }
    })
    return stats
  }

}
