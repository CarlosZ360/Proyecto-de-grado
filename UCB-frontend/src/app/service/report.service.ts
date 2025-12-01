import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as FileSaver from 'file-saver';
import { environment } from '../../environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class ReportService {

  token = localStorage.getItem('token');

  constructor(private http: HttpClient) { }
  //Función para mandar un archivo .txt y crear reporte
  public postReport(file: File, id: number): Observable<any>{
    const header = {
      'Authorization': `Bearer ${this.token}`
    };
    const data = new FormData();
    data.append('archivo', file);
    data.append('id', id.toString());
    return this.http.post<any>(`${environment.BACKEND_URL}/api/report`, data, { headers: header });
  }

  //Función para obtener los reportes de una auditoria
  public getReports(id: number){
    const header = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${this.token}`

    };
    return this.http.get(`${environment.BACKEND_URL}/api/report/audit/${id}`, { headers: header });
  }

  //Función para obtener un reporte por su id
  public getReport(id: number){
    const header = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${this.token}`

    };
    return this.http.get(`${environment.BACKEND_URL}/api/report/${id}`, { headers: header });
  }



  //Generar reporte final 
  public postReportFinal(file: File, file2: File, id: number, observation: string): Observable<any>{
    const header = {
      'Authorization': `Bearer ${this.token}`

    };
    const data = new FormData();
    data.append('archivo', file);
    data.append('archivo2', file2);
    data.append('id', id.toString());
    data.append('observation', observation);
    return this.http.post<any>(`${environment.BACKEND_URL}/api/report/final`, data, { headers: header });
  }
  //Funcion para obtener un reporte final por su id
  public getReportFinal(id: number){
    const header = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${this.token}`

    };
    return this.http.get(`${environment.BACKEND_URL}/api/report/final/${id}`, { headers: header });
  }

  //Función para obtener los reportes finales de un reporte
  public getReportsFinal(id: number){
    const header = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${this.token}`

    };
    return this.http.get(`${environment.BACKEND_URL}/api/report/final/report/${id}`, { headers: header });
  }

  //Función para obtener todos los hashes de la base de datos
  public getHashes(){
    const header = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${this.token}`
    };
    return this.http.get(`${environment.BACKEND_URL}/api/hashes`, { headers: header });
  }

  //Función para leer un archivo .txt
  //Función para mandar un archivo .txt y crear reporte
  public postPotfile(file: File): Observable<any>{
    const header = {
      'Authorization': `Bearer ${this.token}`
    };
    const data = new FormData();
    data.append('archivo', file);
    return this.http.post<any>(`${environment.BACKEND_URL}/api/hashes`, data, { headers: header });
  }

  //Función para obtener datos del dashboard
  public getDashboard(){
    const header = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${this.token}`
    };
    return this.http.get(`${environment.BACKEND_URL}/api/dashboard`, { headers: header });
  }

  //Función para actualizar configuración del dashboard
  public postDashboard(five: boolean, thirteenthirteen: boolean, twenty: boolean, state: boolean){
    const header = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${this.token}`
    };
    const data = {
      "five": five,
      "thirteen": thirteenthirteen,
      "twenty": twenty,
      "state": state
    };

    return this.http.put(`${environment.BACKEND_URL}/api/updateDashboard`, data, { headers: header });
  }

}
