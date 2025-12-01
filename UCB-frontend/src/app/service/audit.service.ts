import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class AuditService {

  token = localStorage.getItem('token');


  constructor(private http: HttpClient ) { }

  //Función para obtener los registros de auditoría por companyId
  public getAuditsByCompanyId(companyId: number){
    const header = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${this.token}`

    };
    return this.http.get(`${environment.BACKEND_URL}/api/audit/company/${companyId}`, { headers: header });
  }

  //Función para obtener los registros de auditoría por clienteId
  public getAuditsByClientId(clientId: number){
    const header = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${this.token}`

    };
    return this.http.get(`${environment.BACKEND_URL}/api/audit/client/${clientId}`, { headers: header });
  }

  //Función para crear un nuevo registro de auditoría
  public createAudit(name: String, date: Date, companyId: number, employeeIds: number[]): Observable<any>{
    const header = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${this.token}`
    };
    const data = {
      "name": name,
      "date": date,
      "companyId": companyId,
      "employeeIds": employeeIds
    };
    
    return this.http.post<any>(`${environment.BACKEND_URL}/api/audit`, data, { headers: header });
  }
  //Función para eliminar una auditoria
  public deleteAudit(id: number): Observable<any>{
    const header = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${this.token}`

    };
    return this.http.delete<any>(`${environment.BACKEND_URL}/api/audit/${id}`, { headers: header });
  }

  //Función para editar una auditoria
  public editAudit(id: number, name: String, date: Date, companyId: number, employeeIds: number[]): Observable<any>{
    const header = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${this.token}`

    };
    const data = {
      "name": name,
      "date": date,
      "companyId": companyId,
      "employeeIds": employeeIds
    };
    return this.http.put<any>(`${environment.BACKEND_URL}/api/audit/${id}`, data, { headers: header });
  }

}
