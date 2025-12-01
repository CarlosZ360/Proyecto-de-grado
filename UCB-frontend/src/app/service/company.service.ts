import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';



@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  token = localStorage.getItem('token');

  constructor(private http: HttpClient) { }



  //Función para obtener las compañias
  public getCompanys(){
    const header = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${this.token}`
    };
    return this.http.get(`${environment.BACKEND_URL}/api/companies`, { headers: header });
  }
  //Función para obtener una compañia por id
  public getCompanyById(companyId: number){
    const header = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${this.token}`
    };
    return this.http.get(`${environment.BACKEND_URL}/api/company/${companyId}`, { headers: header });
  }
  
  //Función para crear una nueva compañia
  public createCompany(name: string, abrevation: string): Observable<any>{
    const header = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${this.token}`
    };
    const data = {
      "name": name,
      "abrevation": abrevation,
    };
    
    return this.http.post<any>(`${environment.BACKEND_URL}/api/company`, data, { headers: header });
  }
  //Función para actualizar una compañia
  public updateCompany(id: number, name: string, abrevation: string): Observable<any>{
    const header = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${this.token}`

    };
    const data = {
      "name": name,
      "abrevation": abrevation,
    };
    
    return this.http.put<any>(`${environment.BACKEND_URL}/api/company/${id}`, data, { headers: header });
  }
  //Función para eliminar una compañia
  public deleteCompany(id: number): Observable<any>{
    const header = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${this.token}`

    };
    return this.http.delete<any>(`${environment.BACKEND_URL}/api/company/${id}`, { headers: header });
  }

  //Función para obtener las estadisticas de una compañia
  public getStats(companyId: number){
    const header = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${this.token}`
    };
    return this.http.get(`${environment.BACKEND_URL}/api/client/stats/${companyId}`, { headers: header });
  }
}
