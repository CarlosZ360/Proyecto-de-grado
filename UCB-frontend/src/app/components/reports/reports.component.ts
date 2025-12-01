import { Component, ViewChild} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CollaboratorService } from '../../service/collaborator.service';
import { AuditService } from '../../service/audit.service';
import { ReportService } from '../../service/report.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent {

  admin: boolean = false;
  client: boolean = false;
  //consultor: boolean = false;

  constructor(private router: Router, private collaboratorService: CollaboratorService, private auditService: AuditService, private route: ActivatedRoute, private reportService: ReportService) { 
    const rol = localStorage.getItem('rol');
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');

    //Obtener el id del cliente de la ruta
    this.route.params.subscribe(params => {
      this.clientId = params['customer'];
    });

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
  @ViewChild('errorMessage') errorMessage: any;
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

  // Popup de confirmación
  confirmationPopup = false;
  // Popup de error
  errorPopup = false;
  // Popup de cargando
  loadingPopup = false;

  id: any;
  clientId: any;
  Nid: number = 0;
  //id: number = 0;
  //storyId: string | null;

  ngOnInit(){
    //Obtener id de la auditoria
    this.route.params.subscribe(params => {
      this.id = params['audit'];
    });
    this.route.params.subscribe(params => {
      this.clientId = params['customer'];
    });
    //this.id = this.route.snapshot.paramMap.get('audit');
    this.filteredCustormers = this.customer;
    this.total = this.reports.length;
    //Obtener lista reportes por auditoria
    this.reportService.getReports(this.id).subscribe((data: any) => {
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


  isDialogVisible = false;
  newReport(){
    
    this.isDialogVisible = true;
  }
  //===========================================================================================================================
  //Logica para cargado de archivo .txt
  importFile: File = new File([""], "archivo");
  onFileChange(event: any) {
    const file: File = event.target.files[0];
    this.importFile = file;
    
    this.file = file.name;
    //this.uploadFile(file);
  }
  //Popup
  createReport(){
    this.isDialogVisible = false;
    this.loadingPopup = true;
    this.reportService.postReport(this.importFile, this.id).subscribe((data: any) => {
      if(data.success == true){
        this.loadingPopup = false;
        this.confirmationPopup = true;
        //Agregar reporte a la lista de reportes
        this.reports.push({reportId: data.data, name: data.data.name, status: data.data.status, date: data.data.date});
        this.total++;
        //En caso de que el total de reportes sea mayor a la cantidad de reportes por página
        if(this.reportsFilter.length < this.inputValue2){
          this.reportsFilter.push({reportId: data.data, name: data.data.name, status: data.data.status, date: data.data.date});
          this.onInputChange();
        }
      } else {
        this.loadingPopup = false;
        this.errorPopup = true;
      }
    },
    (error) => {
      
      this.errorPopup = true;
      }
    );
  }
  cancel(){
    this.isDialogVisible = false;
  }


  //Redireccionar a vista de reporte
  redirectReport(report: any){
    this.router.navigate(['/customers',this.clientId, this.id, report]);
  }

  //Redireccionar a vista de reporte
  redirectReportFinal(report: any){
    this.router.navigate(['/customers',this.clientId, this.id, report, 'final']);
  }  
  
}
