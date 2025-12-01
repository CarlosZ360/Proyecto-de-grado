import { Component, ViewChild} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CollaboratorService } from '../../service/collaborator.service';
import { AuditService } from '../../service/audit.service';
import { ReportService } from '../../service/report.service';
import * as CryptoJS from 'crypto-js';



@Component({
  selector: 'app-audit-client',
  templateUrl: './audit-client.component.html',
  styleUrl: './audit-client.component.css'
})
export class AuditClientComponent {

  
  admin: boolean = false;
  client: boolean = false;
  //consultor: boolean = false;
  id: number = 0;  
  rol: string = '';

  constructor(private router: Router, private collaboratorService: CollaboratorService, private auditService: AuditService, private route: ActivatedRoute, private reportService: ReportService) { 
    
    const rol = localStorage.getItem('rol');
    const id = localStorage.getItem('id');

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
      this.router.navigate(['/audit']);
      this.client = true;
    } else {
      window.alert('No has iniciado sesión');
      this.router.navigate(['/login']);
    }
    //Asignar el valor del id del cliente del toke
    if (id) {
      const secretKey = 'Dr34ml4b';
      // Descifrar el valor cifrado utilizando AES
      const bytes = CryptoJS.AES.decrypt(id, secretKey);
      const decryptedAuditIdString = bytes.toString(CryptoJS.enc.Utf8);
  
      // Convertir la cadena de texto descifrada de vuelta a número
      this.id  = parseInt(decryptedAuditIdString, 10);
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
  audits: any[] = [];
  //Auditorias filtradas
  auditsFilter: any[] = [];

  collaborators: any[] = [];
  employees: any[] = [];
  selectedEmployees: number[]= [];

  selectedEmployeeIds: number[] = []; // IDs de empleados seleccionados
  assignedEmployees: any[] = []; // Lista de empleados asignados


  ngOnInit(){
    this.filteredCustormers = this.customer;
    //Obtener lista de auditoria por cliente
    this.auditService.getAuditsByClientId(this.id).subscribe((data: any) => {
      this.customer = data;
      this.filteredCustormers = this.customer;
      this.total = this.customer.length;
      this.audits = data.data;
      this.total = this.audits.length;
      //Recortar el dato date para que solo muestre la fecha
      this.audits.forEach((element: any) => {
        element.date = element.date.slice(0, 10);
      });
      for (let i = 0; i < this.inputValue2; i++) {
        //Validar que el espacio no este vacio
        if (this.audits[i] != undefined) {
          this.auditsFilter.push(this.audits[i]);
        }
      }
    });

  }

  //Función para buscar clientes
  onInputChange(){
    this.auditsFilter = [];
    this.inicio = (this.inputValue2 * (this.paginaActual - 1)) + 1;
    this.fin = (this.inputValue2 * this.paginaActual)
    if (this.fin > this.total) {
      this.fin = this.total;
      for (let i = this.inicio - 1; i < this.fin; i++) {
        this.auditsFilter.push(this.audits[i]);
      }
    } else{
      //Agregar auditorias al arreglo de auditorias filtrados	segun inputValue2
      for (let i = this.inicio - 1; i < this.fin; i++) {
      this.auditsFilter.push(this.audits[i]);
      } 
    }
  }

  //Función para cambiar de página
  onPageChange(page: number): void {
    this.paginaActual = page;
    this.onInputChange();
  }

  //Función para redireccionar a historial de cliente
  redirectCustomer(customer: any){
    this.router.navigate(['/audit']);
    localStorage.setItem('audit', customer);

  }
  //===========================================================================================================================
  //Logica para el popup - agregar
  //Función para nueva auditoria
  isDialogVisible = false;
  newRecord(){
   this.isDialogVisible = true;
  }

  
  lastId: number = 0;
  create() {
    //Validar que los campos no esten vacios
    if (this.name !='' && this.file != '' && this.selectedEmployeeIds.length > 0) {
      //Obtener la fecha actual
      const date = new Date();
      const currentDate = date.toISOString().slice(0, 10);
      // Crear una nueva auditoria aquí
      this.auditService.createAudit(this.name, date, this.id, this.selectedEmployeeIds).subscribe((data: any) => {
        this.lastId = data.data
        // Agregar al arreglo
        this.audits.push({auditId: this.lastId, name: this.name, date: currentDate, file: this.file, employee: this.assignedEmployees});
        //Limpiar campos
        this.name = '';
        this.file = '';
        this.selectedEmployeeIds = [];
        this.assignedEmployees = [];
        //Crear nuevo reporte
        this.uploadFile(this.importFile, this.lastId);
      });
     
      this.isDialogVisible = false; // Cierra el cuadro de diálogo

    }else{
      //Mostrar mensaje de error
      this.errorMessage.nativeElement.classList.add('show');
      setTimeout(() => {
        this.errorMessage.nativeElement.classList.remove('show');
      }, 2000);
    }

 }

 cancel() {
   // Cancela la eliminación aquí
   this.isDialogVisible = false; // Cierra el cuadro de diálogo
 }  
 //========================================================================================================================
 //Logica para eliminar una auditoria
  isDeleteDialogVisible = false;
  auditId: number = 0;
  deleteAudit(auditId: number){
    this.isDeleteDialogVisible = true;
    this.auditId = auditId;
  }
  confirmDelete(){
    this.isDeleteDialogVisible = false;
    //Eliminar auditoria del arreglo
    for (let i = 0; i < this.audits.length; i++) {
      if (this.audits[i].auditId == this.auditId) {
        this.audits.splice(i, 1);
      }
    }

    //Eliminar auditoria de la base de datos
    this.auditService.deleteAudit(this.auditId).subscribe((data: any) => {
    });
  }
  cancelDelete() {
    // Cancela la eliminación aquí
    this.isDeleteDialogVisible = false; // Cierra el cuadro de diálogo
  }
  //========================================================================================================================
  //Redireccionar a la vista de reportes
  redirectReport(auditId: string){
    // Encriptar el auditId
    const encryptedAuditId = this.encryptData(auditId);
    this.router.navigate(['/reports']);
    // Guardar el auditId encriptado en el localStorage
    localStorage.setItem('audit', encryptedAuditId);
  }


  encryptData(auditId: string): string {
    // Clave secreta utilizada para el cifrado
    const secretKey = 'Dr34ml4b'
    // Convertir el número a una cadena de texto
    const auditIdString = auditId.toString();
    // Cifrar la cadena de texto utilizando AES
    const encryptedAuditId = CryptoJS.AES.encrypt(auditIdString, secretKey).toString();
    return encryptedAuditId;
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
  uploadFile(file: File, auditId: number) {
    this.reportService.postReport(file, auditId).subscribe((data: any) => {
    });
  }

}
