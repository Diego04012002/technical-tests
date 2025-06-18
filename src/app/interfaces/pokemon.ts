interface Pokemon{
  name:string
  id:number
  height:number
  weight:number
  stats:StatsSlot[]
  sprites: {
    other:{
      dream_world:{
        front_default:string
      },
    },
  }
  types:{slot:number; type:Type}[]
  species:PokemonDefault
  evolution_chain:{url:string}
}