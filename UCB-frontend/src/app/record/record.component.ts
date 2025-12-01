import { Component, ViewChild} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CollaboratorService } from '../service/collaborator.service';
import { AuditService } from '../service/audit.service';
import { ReportService } from '../service/report.service';


@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrl: './record.component.css'
})
export class RecordComponent {

  admin: boolean = false;
  client: boolean = false;
  consultor: boolean = false;

  constructor(private router: Router, private collaboratorService: CollaboratorService, private auditService: AuditService, private route: ActivatedRoute, private reportService: ReportService) { 
    
    const rol = localStorage.getItem('rol');
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');

    if(rol == 'ADMINISTRADOR') {
      this.admin = true;
    } else if (rol == 'CONSULTOR') {
      this.consultor = true;
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
  file:string = '';

  //Logica para la paginación 
  audits: any[] = [];
  //Auditorias filtradas
  auditsFilter: any[] = [];


  //Variables para la lista de colaboradores
  collaborators: any[] = [];
  collaboratorsAux: any[] = [];
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

  id: number = 0;

  ngOnInit(){

    this.route.params.subscribe(params => {
      this.id = params['customer'];
    });
    

    this.filteredCustormers = this.customer;
    
    //Obtener lista de auditoria por cliente
    this.auditService.getAuditsByCompanyId(this.id).subscribe((data: any) => {
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

    //Obtener lista de colaboradores - Consultores
    this.collaboratorService.getConsultants().subscribe((data: any) => {
      this.collaborators = data.data;
      this.collaboratorsAux = data.data;
    });

  }

  //Función para filtrar auditorias
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
    this.router.navigate(['/customers', customer]);
  }
  //===========================================================================================================================
  //Logica para el popup - agregar
  //Función para nueva auditoria
  isDialogVisible = false;
  newRecord(){
    //  this.userId = userId;
   this.isDialogVisible = true;
  }
    //Agregar empleados a la lista de empleados asignados
    addEmployee(employeeData: any): void {
      
      const [employeeId, name, lastName] = employeeData.split(',');
      
      //Agregar nombre y apellido a la lista de empleados asignados
      const employee = {employeeId: employeeId, name: name, lastName: lastName};
      if (employee && !this.assignedEmployees.includes(employee)) {
        this.assignedEmployees.push(employee);
        this.selectedEmployeeIds.push(parseInt(employeeId));
        this.collaborators = this.collaborators.filter(emp => emp.employeeId !== parseInt(employeeId));
      }
      
    }

    removeEmployee(employeeId: number): void {
      const removedEmployeeIndex = this.assignedEmployees.findIndex(emp => emp.employeeId === employeeId);
      if (removedEmployeeIndex !== -1) {
          const removedEmployee = this.assignedEmployees.splice(removedEmployeeIndex, 1)[0];
          this.selectedEmployeeIds = this.selectedEmployeeIds.filter(id => id !== parseInt(removedEmployee.employeeId));
          //
          if (!this.collaborators.some(emp => emp.employeeId === employeeId)) {
              this.collaborators.push({ employeeId: parseInt(removedEmployee.employeeId), name: removedEmployee.name, lastName: removedEmployee.lastName });
          }
      }
    }
  
  lastId: number = 0;
  create() {
    //Validar que los campos no esten vacios
    if (this.name !='' && this.file != '' && this.selectedEmployeeIds.length > 0) {
      this.loadingPopup = true;
      //Obtener la fecha actual
      const date = new Date();
      const currentDate = date.toISOString().slice(0, 10);
      // Crear una nueva auditoria aquí
      this.auditService.createAudit(this.name, date, this.id, this.selectedEmployeeIds).subscribe((data: any) => {

        this.lastId = data.data
        // Agregar al arreglo
        this.audits.push({auditId: this.lastId, name: this.name, date: currentDate, file: this.file, employee: this.assignedEmployees});
        this.total++;
        //Limpiar campos
        this.name = '';
        this.file = '';
        this.selectedEmployeeIds = [];
        this.assignedEmployees = [];
        //En caso de que en el filtrado estes al final de la lista, agregar a su arreglo y actualizar
        if (this.auditsFilter.length < this.inputValue2) {
          this.auditsFilter.push({auditId: this.lastId, name: this.name, date: currentDate, file: this.file, employee: this.assignedEmployees});
          this.onInputChange();
        }       
        //Restablecer la lista de colaboradores
        this.collaborators = this.collaboratorsAux;  
        //Remover empleados seleccionados
        this.assignedEmployees = [];
        this.isDialogVisible = false; // Cierra el cuadro de diálogo

        //Crear nuevo reporte
        this.uploadFile(this.importFile, this.lastId);
      },
      (error) => {
        this.loadingPopup = false;
        this.errorPopup = true;
        }
      );
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
   //Restablecer la lista de colaboradores
   this.collaborators = this.collaboratorsAux;  
   //Remover empleados seleccionados
   this.assignedEmployees = [];
   this.isDialogVisible = false; // Cierra el cuadro de diálogo
   this.name = '';
   this.file = '';

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
    this.loadingPopup = true;
    //Eliminar auditoria de la base de datos
    this.auditService.deleteAudit(this.auditId).subscribe((data: any) => {
    //Eliminar auditoria del arreglo
    for (let i = 0; i < this.audits.length; i++) {
      if (this.audits[i].auditId == this.auditId) {
        this.audits.splice(i, 1);
      }
    }      
    //Eliminar auditoria del arreglo filtrado
    for (let i = 0; i < this.auditsFilter.length; i++) {
      if (this.auditsFilter[i].auditId == this.auditId) {
        this.auditsFilter.splice(i, 1);
        this.total--;
        this.onInputChange();
      }
    }
    this.loadingPopup = false;
    });
  }
  cancelDelete() {
    // Cancela la eliminación aquí
    
    this.isDeleteDialogVisible = false; // Cierra el cuadro de diálogo
  }
  //========================================================================================================================
  //Redireccionar a la vista de reportes
  redirectReport(auditId: number){
    
    this.router.navigate(['/customers', this.id ,auditId]);
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
      ;
      if(data.success == true){
        this.loadingPopup = false;
        this.confirmationPopup = true;
      }
      
    });
  }
  //===========================================================================================================================
  //Logica para editar una auditoria
  isEditDialogVisible = false;
  Auditedit: any[] = [];
  date: any;
  editAuditId: number = 0;
  editAudit(Audit: any){
    //asignar valores a los campos
    this.name = Audit.name;
    this.date = Audit.date;
    this.editAuditId = Audit.auditId;
    
    this.isEditDialogVisible = true;
  }

  edit(){
    
    //Validar que los campos no esten vacios

    if (this.name !='' && this.selectedEmployeeIds.length > 0) {
      this.loadingPopup = true; // Popup de cargando
      //Obtener la fecha de la auditoria
      const date = this.date
      // Crear una nueva auditoria aquí
      this.auditService.editAudit(this.editAuditId, this.name, date, this.id, this.selectedEmployeeIds).subscribe((data: any) => {
        this.loadingPopup = false;
        //Restablecer la lista de colaboradores
        this.collaborators = this.collaboratorsAux;  
        //Remover empleados seleccionados
        this.assignedEmployees = [];
        //Actualizar la auditoria en el arreglo
        for (let i = 0; i < this.audits.length; i++) {
          if (this.audits[i].auditId == this.editAuditId) {
            this.audits[i].name = this.name;
            this.audits[i].date = date;
          }
        }

        this.isDialogVisible = false; // Cierra el cuadro de diálogo    
      });
      this.isEditDialogVisible = false; // Cierra el cuadro de diálogo
    } else {
      console.log('error');
      //Mostrar mensaje de error
      this.errorMessage.nativeElement.classList.add('show');
      setTimeout(() => {
        this.errorMessage.nativeElement.classList.remove('show');
      }, 2000);
    }
  }
  cancelEdit(){
    //Restablecer la lista de colaboradores
    this.collaborators = this.collaboratorsAux;  
    //Remover empleados seleccionados
    this.assignedEmployees = [];
   
    this.isDialogVisible = false; // Cierra el cuadro de diálogo    
    this.isEditDialogVisible = false;
    this.name = '';
    
  }


}



