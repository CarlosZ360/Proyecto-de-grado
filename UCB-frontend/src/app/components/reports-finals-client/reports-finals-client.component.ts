import { Component, ViewChild} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CollaboratorService } from '../../service/collaborator.service';
import { AuditService } from '../../service/audit.service';
import { ReportService } from '../../service/report.service';
import * as CryptoJS from 'crypto-js';


@Component({
  selector: 'app-reports-finals-client',
  templateUrl: './reports-finals-client.component.html',
  styleUrl: './reports-finals-client.component.css'
})
export class ReportsFinalsClientComponent {


  admin: boolean = false;
  client: boolean = false;
  //consultor: boolean = false;
  reportId: number = 0;
  rol: string = '';


  constructor(private router: Router, private collaboratorService: CollaboratorService, private auditService: AuditService, private route: ActivatedRoute, private reportService: ReportService) { 
    const rol = localStorage.getItem('rol');
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');
    const report = localStorage.getItem('report-final');

    if(rol){
      const secretKey = 'Dr34ml4b';
      // Descifrar el valor cifrado utilizando AES
      const bytes = CryptoJS.AES.decrypt(rol, secretKey);
      const decryptedAuditIdString = bytes.toString(CryptoJS.enc.Utf8);
  
      // Convertir la cadena de texto descifrada de vuelta a número
      this.rol  = decryptedAuditIdString, 10;
    }

    if(this.rol == 'ADMINISTRADOR' || this.rol == 'CONSULTOR') {
      
      this.admin = true;
    } else if (this.rol == 'CLIENTE') {
      //this.router.navigate(['/audit']);
      this.client = true;
    } else {
      window.alert('No has iniciado sesión');
      this.router.navigate(['/login']);
    }
    
    
    
    //Asignar el valor ed audit
    if (report) {
      const secretKey = 'Dr34ml4b';
      // Descifrar el valor cifrado utilizando AES
      const bytes = CryptoJS.AES.decrypt(report, secretKey);
      const decryptedAuditIdString = bytes.toString(CryptoJS.enc.Utf8);
  
      // Convertir la cadena de texto descifrada de vuelta a número
      this.reportId  = parseInt(decryptedAuditIdString, 10);
    }    

  }

  searchCustomer = new FormControl();
  pageSize = new FormControl();
  page = new FormControl();
  customer: any[] = [];
  filteredCustormers: any[] = []; // Arreglo filtrado de clientes
  searchText: string = ''; // Texto de busqueda
  inputValue2: number = 10;
  total: number = 0;
  elementosPorPagina = 10;
  paginaActual = 1;
  mathProperty: any;
  inicio = 1;
  fin = 10;

  //Variables del popup
  name:string = '';
  consultor:string = '';
  file:string = '';

  //Logica para la paginación 
  reports: any[] = [];
  //Reportes filtrados
  reportsFilter: any[] = [];

  collaborators: any[] = [];
  employees: any[] = [];
  selectedEmployees: number[]= [];

  selectedEmployeeIds: number[] = []; // IDs de empleados seleccionados
  assignedEmployees: any[] = []; // Lista de empleados asignados

  auditId: any;
  clientId: any;
  Nid: number = 0;
  //id: number = 0;
  //storyId: string | null;

  ngOnInit(){

    
    this.filteredCustormers = this.customer;
    this.total = this.reports.length;
    //Obtener lista reportes por auditoria
    this.reportService.getReportsFinal(this.reportId).subscribe((data: any) => {
      this.reports = data.data;
      this.filteredCustormers = this.reports;
      this.total = this.reports.length;
      for (let i = 0; i < this.inputValue2; i++) {
        //Validar que el espacio no este vacio
        if (this.reports[i] != undefined) {
          this.reportsFilter.push(this.reports[i]);
        }
      }
    });
    
  }

  //Función para buscar clientes
  onInputChange(){
    this.reportsFilter = [];
    this.inicio = (this.inputValue2 * (this.paginaActual - 1)) + 1;
    this.fin = (this.inputValue2 * this.paginaActual) 
    if (this.fin > this.total) {
      this.fin = this.total;
      for (let i = this.inicio - 1; i < this.fin; i++) {
        this.reportsFilter.push(this.reports[i]);
      }
    }else{
      //Agregar reportes al arreglo de reportes filtrados	segun inputValue2
      for (let i = this.inicio - 1; i < this.fin; i++) {
        this.reportsFilter.push(this.reports[i]);
      } 
    }
  }

  //Función para cambiar de página
  onPageChange(page: number): void {
    this.paginaActual = page;
    this.onInputChange();
  }  

  //Redireccionar a vista de reporte
  redirectReport(report: any){
    const reportFinal = this.encryptData(report);
    localStorage.setItem('report-finalId', reportFinal);
    this.router.navigate(['reports-finals/view']);
  }  

  //Función para cifrar
  encryptData(auditId: string): string {
    // Clave secreta utilizada para el cifrado
    const secretKey = 'Dr34ml4b'
    // Convertir el número a una cadena de texto
    const auditIdString = auditId.toString();
    // Cifrar la cadena de texto utilizando AES
    const encryptedAuditId = CryptoJS.AES.encrypt(auditIdString, secretKey).toString();
    return encryptedAuditId;
  }


}
