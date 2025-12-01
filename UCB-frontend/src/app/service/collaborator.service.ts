import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CollaboratorService {

  token = localStorage.getItem('token');

  constructor(private http: HttpClient) { }

  //Función para obtener un colaborador por id
  public getCollaboratorById(id: number){
    const header = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${this.token}`
    };
    return this.http.get(`${environment.BACKEND_URL}/api/employee/${id}`, { headers: header });
  }

  //Función para crear un nuevo colaborador
  public createCollaborator(name: string, lastName: string, phone: string, email: string, password: string, role: string): Observable<any>{
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
      "role": role,
      "password": password,
    };
    
    return this.http.post<any>(`${environment.BACKEND_URL}/api/employee`, data, { headers: header });
  }


  //Función para obtener los colaboradores
  public getCollaborators(){
    const header = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${this.token}`

    };
    return this.http.get(`${environment.BACKEND_URL}/api/employee`, { headers: header });
  }
  
  //Función para obtener los colaboradores con rol CONSULTOR
  public getConsultants(){
    const header = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${this.token}`

    };
    return this.http.get(`${environment.BACKEND_URL}/api/employee/consultor`, { headers: header });
  }

  //Función para editar colaboradores
  public editCollaborator(id: number, name: string, lastName: string, phone: string, email: string, password: string, role: string): Observable<any>{
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
      "role": role,
      "password": password
    };
    
    return this.http.put<any>(`${environment.BACKEND_URL}/api/employee/${id}`, data, { headers: header });
  }

    //Función para autenticacíon
    public postLogin(email: string, password: string){
      const header = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${this.token}`

      };
      const data = {
        'email': email,
        'password': password
      };
      return this.http.post(`${environment.BACKEND_URL}/api/auth/`, data, { headers: header });
    }

    //Función para actualizar contraseña
    public updatePassword(email: string, password: string){
      const header = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      }
      return this.http.put(`${environment.BACKEND_URL}/api/employee/password?email=${email}&password=${password}`, {}, { headers: header });
    }

}
