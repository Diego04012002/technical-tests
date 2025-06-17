import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokemonRequest {

   private apiUrl = 'https://pokeapi.co/api/v2';

  constructor(private http: HttpClient) {}

  getPokemonTypes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/type`);
  }

  getPokemonsByType(typeUrl: string): Observable<any> {
    return this.http.get(typeUrl);
  }

  getPokemonDetails(url: string): Observable<any> {
    return this.http.get(url);
  }

  getPokemonSpecie(url:string){
    return this.http.get(url)
  }

  getPokemonDetailById(id:string){
    return this.http.get(this.apiUrl + "/pokemon/" + id)
  }

  getPokemonMoves(){
    return this.http.get(this.apiUrl + "/move?limit=1000")
  }
}
