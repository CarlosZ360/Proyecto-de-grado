import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CompanyService } from '../../service/company.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrl: './company.component.css'
})
export class CompanyComponent {

  
  constructor(private router: Router, private companyService: CompanyService) {
    const rol = localStorage.getItem('rol');
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');
    if(rol == 'ADMINISTRADOR' || rol == 'CONSULTOR') {
      
    } else if (rol == 'CLIENTE') {
      window.alert('No tienes permisos para acceder a esta página');
      this.router.navigate(['/customers/'+id]);
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
  inputValue2: number = 5;
  total: number = 0;
  elementosPorPagina = 10;
  paginaActual = 1;
  mathProperty: any;
  inicio = 1;
  fin = 5;

  //Variables del popup
  name:string = '';
  abrevation:string = '';

  //Logica para la paginación - arreglar****
  companys: any[] = [];
  //Compañias filtradas
  companysFilter: any[] = [];
  // Popup de confirmación
  confirmationPopup = false;
  // Popup de error
  errorPopup = false;
  // Popup de cargando
  loadingPopup = false;

  ngOnInit(){
    this.filteredCustormers = this.customer;
    this.total = this.companys.length;
    //Obtener lista de compañias
    this.companyService.getCompanys().subscribe((data: any) => {
      this.customer = data;
      this.filteredCustormers = this.customer;
      
      this.companys = data.data;
      this.total = this.companys.length;

      for (let i = 0; i < this.inputValue2; i++) {
        //Validar que el espacio no este vacio
        if (this.companys[i] != undefined) {
          this.companysFilter.push(this.companys[i]);
        }
      }
    });
  } 

  //Función para agregar compañias al arreglo de compañias filtradas
  onInputChange(){
    this.companysFilter = [];
    this.inicio = (this.inputValue2 * (this.paginaActual - 1)) + 1;
    this.fin = (this.inputValue2 * this.paginaActual)
    if (this.fin > this.total) {
      this.fin = this.total;
      for (let i = this.inicio - 1; i < this.fin; i++) {
        this.companysFilter.push(this.companys[i]);
        }
    } else{
      //Agregar compañias al arreglo de compañias filtradas	segun inputValue2
      for (let i = this.inicio - 1; i < this.fin; i++) {
      this.companysFilter.push(this.companys[i]);
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
  //Logica para el popup
  //Función para nueva compañia
  isDialogVisible = false;
  newRecord(){
    //  this.userId = userId;
   this.isDialogVisible = true;
  }

 confirm() {
  //Validar que los campos no esten vacios
    if (this.name !='' && this.abrevation != '') {
      this.isDialogVisible = false; // Cierra el cuadro de diálogo
      this.loadingPopup = true; // Popup de cargando
      //Crear nueva compañia
      this.companyService.createCompany(this.name, this.abrevation).subscribe((data: any) => {
        this.loadingPopup = false;
        this.confirmationPopup = true;
        //Agregar nueva compañia al arreglo
        this.companys.push({companyId: data.data , name:this.name, abrevation: this.abrevation});
        this.total++;
        this.name = '';
        this.abrevation = '';
        //En caso de que en el filtrado estes al final de la lista, agregar a su arreglo y actualizar
        if (this.companysFilter.length < this.inputValue2) {
          this.companysFilter.push({companyId: data.data , name:this.name, abrevation: this.abrevation});
          this.onInputChange();
        }
        
      },
      (error) => {
        this.loadingPopup = false;
        this.errorPopup = true;
        }
      );
    
    }else{
      
      //Mostrar mensaje de error
      this.errorMessage.nativeElement.classList.add('show');
      setTimeout(() => {
        this.errorMessage.nativeElement.classList.remove('show');
      }, 2000);
    }
  }

 cancel(){
   // Cancela la eliminación aquí
   
   this.isDialogVisible = false; // Cierra el cuadro de diálogo
 }
 //========================================================================================================================
 //Logica para editar una compañia
 isEditDialogVisible = false;  
 companyId: number = 0; 
 editcompany(companyId: number){
    this.isEditDialogVisible = true;
    this.companyId = companyId;
    
    //Poner nombre y abreviatura de la compañia en los campos de texto
    for (let i = 0; i < this.companys.length; i++) {
      if (this.companys[i].companyId == companyId) {
        this.name = this.companys[i].name;
        this.abrevation = this.companys[i].abrevation;
      }
    }
 }
 confirmEdit(){
    
    this.isEditDialogVisible = false;
    //Validar que los campos no esten vacios
    if (this.name !='' && this.abrevation != '') {
      //Actualizar compañia en el arreglo
      for (let i = 0; i < this.companys.length; i++) {
        if (this.companys[i].companyId == this.companyId) {
          this.companys[i].name = this.name;
          this.companys[i].abrevation = this.abrevation;
        }
      }
      this.loadingPopup = true; // Popup de cargando
      //Actualizar compañia
      this.companyService.updateCompany(this.companyId, this.name, this.abrevation).subscribe((data: any) => {
        this.loadingPopup = false;
        
      },(error) => {
        this.loadingPopup = false;
        this.errorPopup = true;
        }
    );
      this.name = '';
      this.abrevation = '';
    }
  
  }
 cancelEdit(){
    
    this.isEditDialogVisible = false;
    this.name = '';
    this.abrevation = '';
 }
//==========================================
//Logica para eliminar una compañia
isDeleteDialogVisible = false;
deleteCompanyId: number = 0;
  deleteCompany(companyId: number){
    this.isDeleteDialogVisible = true;
    this.deleteCompanyId = companyId
    
  }
  confirmDelete(){
    
    this.isDeleteDialogVisible = false;
    
    this.loadingPopup = true; // Popup de cargando
    //Eliminar compañia
    this.companyService.deleteCompany(this.deleteCompanyId).subscribe((data: any) => {
      this.loadingPopup = false;
      //Eliminar compañia del arreglo
      for (let i = 0; i < this.companys.length; i++) {
        if (this.companys[i].companyId == this.deleteCompanyId) {
          this.companys.splice(i, 1);
        }
      }
      //Eliminar compañia del arreglo de compañias filtradas y actualizar
      for (let i = 0; i < this.companysFilter.length; i++) {
        if (this.companysFilter[i].companyId == this.deleteCompanyId) {
          this.companysFilter.splice(i, 1);
          //Actualizar total de compañias
          this.total--;
          this.onInputChange();
        }
      }      
    },
    (error) => {
      this.loadingPopup = false;
      this.errorPopup = true;
    }
  );
  }
  cancelDelete(){
    
    this.isDeleteDialogVisible = false;
  }

}
