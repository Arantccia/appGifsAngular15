import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SearchGifsResponse, Gif } from '../interface/gifsInterface';

@Injectable({
  providedIn: 'root'
})


export class GifsService {

  private _historial: string[] = []
  private apiKey: string = 'jMfb3cF73iXmiwBkmNMM2ehxt3Bb01hZ'
  private url:string = 'api.giphy.com/v1/gifs/search';
  
  public result:Gif[] = [] 


  get historial () {
    return [... this._historial];

  }
// el constructor se va a ejecutar una vez el servicio, la 1º vez que sea llamado
// los servicios son singelstone  
  constructor(private http:HttpClient){
    this._historial = JSON.parse(localStorage.getItem('historial')!) || [];
    this.result = JSON.parse(localStorage.getItem('gif')!) || [];
    /*
    loque estamos diciendo arriba es equivalente al if  y el || es el else que devuelve un array bacio si es nulo.
      if(localStorage.getItem('historial')){
      this._historial = JSON.parse(localStorage.getItem('historial')!);
      } 
    */

  }

  buscarGifs( query:string = ''){
    query = query.trim().toLocaleLowerCase()
    if(!this._historial.includes(query)){
     // console.log(query)
      this._historial.unshift(query)
      this._historial = this._historial.splice(0, 10);
      // no guardar nunca información sensible
      localStorage.setItem('historial',JSON.stringify(this._historial))
    }
    
    this.http.get<SearchGifsResponse>(`${this.url}?api_key=${this.apiKey}&q=${query}&limit=10`)
      .subscribe((res)=>{
        this.result = res.data
        //console.log(this.result)
        localStorage.setItem('gif',JSON.stringify(this.result))
        //console.log(res.data)
      })
      /*  
      el observable tiene mayo control que la promesa
      fetch('https://api.giphy.com/v1/gifs/search?api_key=jMfb3cF73iXmiwBkmNMM2ehxt3Bb01hZ&q=dragon ball z&limit=10')
        .then(res =>{
          res.json().then(console.log)
        }) 
        */
    
  
  }


}
