import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { PokemonStats } from '../pokemon-stats/pokemon-stats';

@Component({
  selector: 'app-pokemon-info',
  imports: [PokemonStats],
  templateUrl: './pokemon-info.html',
  styleUrl: './pokemon-info.css'
})
export class PokemonInfo{

  @Input() pokemon!:Pokemon
  @Input() isCompare:boolean=false
  loadingSprite:boolean=false

  constructor(){

  }

  getStatsObject(){
    let stats=this.pokemon.stats.map((data:StatsSlot)=>{
      return {
        name: data.stat.name.toUpperCase(),
        value:data.base_stat
      }
    })
    return stats
  }

}
