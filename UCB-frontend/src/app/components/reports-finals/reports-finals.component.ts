import { Component, ViewChild} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CollaboratorService } from '../../service/collaborator.service';
import { AuditService } from '../../service/audit.service';
import { ReportService } from '../../service/report.service';
import * as CryptoJS from 'crypto-js';


@Component({
  selector: 'app-reports-finals',
  templateUrl: './reports-finals.component.html',
  styleUrl: './reports-finals.component.css'
})
export class ReportsFinalsComponent {

  admin: boolean = false;
  client: boolean = false;
  //consultor: boolean = false;

  constructor(private router: Router, private collaboratorService: CollaboratorService, private auditService: AuditService, private route: ActivatedRoute, private reportService: ReportService) { 
    const rol = localStorage.getItem('rol');
    const token = localStorage.getItem('token');

    if(rol == 'ADMINISTRADOR' || rol == 'CONSULTOR') {
      
      this.admin = true;
    } else if (rol == 'CLIENTE') {
      //this.router.navigate(['/customers/'+id]);
      this.client = true;
    } else {
      window.alert('No has iniciado sesión');
      this.router.navigate(['/login']);
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

  reportId: any;
  auditId: any;
  clientId: any;
  Nid: number = 0;
  //id: number = 0;
  //storyId: string | null;

  ngOnInit(){

    //Obtener id de la auditoria
    this.route.params.subscribe(params => {
      this.reportId = params['report'];
    });
    this.route.params.subscribe(params => {
      this.clientId = params['customer'];
    });
    this.route.params.subscribe(params => {
      this.auditId = params['audit'];
    });
    

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
    this.router.navigate(['/customers',this.clientId, this.auditId, this.reportId, 'final', report]);
  }  

}
