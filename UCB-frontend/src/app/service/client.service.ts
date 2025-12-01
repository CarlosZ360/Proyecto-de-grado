import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  token = localStorage.getItem('token');

  

  constructor(private http: HttpClient) { }

  //Función para obtener un cliente por id
  public getCustomerById(id: number){
    const header = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${this.token}`

    };
    return this.http.get(`${environment.BACKEND_URL}/api/client/${id}`, { headers: header });
  }

  //Función para obtener los clientes
  public getCustomers(){
    const header = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${this.token}`

    };
    return this.http.get(`${environment.BACKEND_URL}/api/clients`, { headers: header });
  }

  //Función para crear un nuevo cliente
  public createCustomer(name: string, lastName: string, phone: string, email: string, company: number, position: string, password: string): Observable<any>{
    const header = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${this.token}`

    };
    const data = {
      "name": name,
      "lastName": lastName,
      "phone": phone,
      "email": email,
      "password": password,
      "position": position,
      "companyId": company,
    };
    
    return this.http.post<any>(`${environment.BACKEND_URL}/api/client`, data, { headers: header });
  }

  //Función para actualizar un cliente
  public updateCustomer(id: number, name: string, lastName: string, phone: string, email: string, company: number, position: string, password: string): Observable<any>{
    const header = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${this.token}`

    };
    const data = {
      "name": name,
      "lastName": lastName,
      "phone": phone,
      "email": email,
      "password": password,
      "position": position,
      "companyId": company,
    };
    
    return this.http.put<any>(`${environment.BACKEND_URL}/api/client/${id}`, data, { headers: header });
  }

  //Función para eliminar un cliente
  public deleteCustomer(id: number): Observable<any>{
    const header = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${this.token}`

    };
    return this.http.delete<any>(`${environment.BACKEND_URL}/api/client/${id}`, { headers: header });
  }

    //Función para actualizar contraseña
    public updatePassword(email: string, password: string){
      
      const header = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      }
      return this.http.put(`${environment.BACKEND_URL}/api/client/password?email=${email}&password=${password}`, {}, { headers: header });
    }

}
