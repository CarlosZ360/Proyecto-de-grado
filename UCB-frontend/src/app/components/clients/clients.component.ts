import { Component, ViewChild, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ClientService } from '../../service/client.service';
import { CompanyService } from '../../service/company.service';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css',
  
})
export class ClientsComponent {

  
  constructor(private router: Router, private clientService:ClientService, private companyService: CompanyService) { 

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
  inputValue2: number = 10;
  total: number = 0;
  elementosPorPagina = 10;
  paginaActual = 1;
  mathProperty: any;
  inicio = 1;
  fin = 10;
  companys: any[] = [];
  inputValue1: number = 1;

  //Variables del popup
  name:string = '';
  lastName:string = '';
  phone:string = '';
  email:string = '';
  company:number = 0;
  position:string = '';
  password:string = '';


  //Logica para la paginación - arreglar****
  users: any[] = [];
  //Usuarios filtrados
  usersFilter: any[] = [];
  // Popup de confirmación
  confirmationPopup = false;
  // Popup de error
  errorPopup = false;  
  // Popup de cargando
  loadingPopup = false;

  ngOnInit(){
    this.filteredCustormers = this.customer;
    this.total = this.users.length;
    //Obtener lista de clientes
    this.clientService.getCustomers().subscribe((data: any) => {
      this.customer = data;
      this.filteredCustormers = this.customer;
      
      
      this.users = data.data;
      this.total = this.users.length;

      for (let i = 0; i < this.inputValue2; i++) {
        //Validar que el espacio no este vacio
        if (this.users[i] != undefined) {
          this.usersFilter.push(this.users[i]);
        }
      }
    });
    //Obtener lista de compañias
    this.companyService.getCompanys().subscribe((data: any) => {
      this.companys = data.data;
      
    });

  }

  //Función para agregar clientes al arreglo de clientes filtrados
  onInputChange(){
    this.usersFilter = [];
    this.inicio = (this.inputValue2 * (this.paginaActual - 1)) + 1;
    this.fin = (this.inputValue2 * this.paginaActual)
    if (this.fin > this.total) {
      this.fin = this.total;
      for (let i = this.inicio - 1; i < this.fin; i++) {
        this.usersFilter.push(this.users[i]);
      }
    } else{
      //Agregar clientes al arreglo de clientes filtrados	segun inputValue2
      for (let i = this.inicio - 1; i < this.fin; i++) {
      this.usersFilter.push(this.users[i]);
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
  //Función para nueva auditoria
  isDialogVisible = false;
  newRecord(){
   //  this.userId = userId;
   this.isDialogVisible = true;
  }

 confirm(){
  //Validar que los campos no esten vacios
  if (this.name !='' && this.lastName != '' && this.phone != '' && this.email != '' && this.inputValue1 != 0 && this.position != '' && this.password != '') {
    this.isDialogVisible = false; // Cierra el cuadro de diálogo
    this.loadingPopup = true;
    //Crear nuevo cliente
    this.clientService.createCustomer(this.name, this.lastName, this.phone, this.email, this.inputValue1, this.position, this.password).subscribe((data: any) => {
      
      if(data.success == true){
        this.loadingPopup = false;
        this.confirmationPopup = true;
        //Agregar nuevo cliente al arreglo
        this.users.push({clientId: data.data , name: this.name, lastName: this.lastName, phone: this.phone, email: this.email, companyId: this.company, position: this.position, password: this.password});
        this.total++;
        // Limpiar campos
        this.name = '';
        this.lastName = '';
        this.phone = '';
        this.email = '';
        this.company = 0;
        this.position = '';
        this.password = '';
        //En caso de que en el filtrado estes al final de la lista, agregar a su arreglo y actualizar
        if (this.usersFilter.length < this.inputValue2) {
          this.usersFilter.push({clientId: data.data , name: this.name, lastName: this.lastName, phone: this.phone, email: this.email, companyId: this.company, position: this.position, password: this.password});
          this.onInputChange();
        }
        
        (this.usersFilter);  

      }else{
        this.loadingPopup = false;
        this.errorPopup = true;
      }
    },
    (error) => {
      (error);
      this.loadingPopup = false;
      this.errorPopup = true;
      }
    );
    //Actualizar cantidad de clientes
    this.total = this.users.length;
  }else{
    ('Campos vacios');
    //Mostrar mensaje de error
    this.errorMessage.nativeElement.classList.add('show');
    setTimeout(() => {
      this.errorMessage.nativeElement.classList.remove('show');
    }, 2000);
  }   
 }

  cancel() {
    // Cancela el agregado
    this.isDialogVisible = false; // Cierra el cuadro de diálogo
  }

  //=========================================================================================
  //Logica para editar cliente
  isDialogVisibleEdit = false;
  nameEdit:string = '';
  lastNameEdit:string = '';
  phoneEdit:string = '';
  emailEdit:string = '';
  companyEdit:number = 0;
  positionEdit:string = '';
  passwordEdit:string = '';
  clientId:number = 0;

  //Al momento de dar click en editar cliente los valores que tiene clientId se le asignan a las variables
  //name, lastName, phone, email, company, position, password
  editClient(clientId: number){
    this.clientId = clientId;
    this.isDialogVisibleEdit = true;
    //Mostrar la data de ese id sin usar service
    this.users.forEach((element: any) => {
      if (element.clientId == clientId) {
        this.nameEdit = element.name;
        this.lastNameEdit = element.lastName;
        this.phoneEdit = element.phone;
        this.emailEdit = element.email;
        this.companyEdit = element.companyId;
        this.positionEdit = element.position;
        (element.companyId);
      }
    });
    
  

    // this.clientService.updateCustomer(clientId, this.name, this.lastName, this.phone, this.email, this.company, this.position, this.password).subscribe((data: any) => {
    //   
    // });
  }  
  confirmEdit(){

    //Validar que los campos no esten vacios
    if(this.nameEdit !='' && this.lastNameEdit != '' && this.phoneEdit != '' && this.emailEdit != '' && this.companyEdit != 0 && this.positionEdit != ''){
      this.isDialogVisibleEdit = false; // Cierra el cuadro de diálogo
      this.loadingPopup = true; // Popup de cargando
      //Actualizar cliente en el arreglo
      this.clientService.updateCustomer(this.clientId,this.nameEdit, this.lastNameEdit, this.phoneEdit, this.emailEdit, this.companyEdit, this.positionEdit, this.passwordEdit).subscribe((data: any) => {
        this.loadingPopup = false;
      });
      if(this.passwordEdit != ''){
        this.clientService.updatePassword(this.emailEdit, this.passwordEdit).subscribe((data: any) => {
          this.loadingPopup = false;
        });
      }
      this.users.forEach((element: any) => {
        if (element.clientId == this.clientId) {
          element.name = this.nameEdit;
          element.lastName = this.lastNameEdit;
          element.phone = this.phoneEdit;
          element.email = this.emailEdit;
          element.companyId = this.companyEdit;
          element.position = this.positionEdit;
        }
      });
            //Limpiar campos
            this.nameEdit = '';
            this.lastNameEdit = '';
            this.phoneEdit = '';
            this.emailEdit = '';
            this.companyEdit = 0;
            this.positionEdit = '';
            this.passwordEdit = '';

    }else{
      //Mostrar mensaje de error
      this.errorMessage.nativeElement.classList.add('show');
      setTimeout(() => {
        this.errorMessage.nativeElement.classList.remove('show');
      }, 2000);
    }   
  }
  cancelEdit() {
    // Cancela la eliminación aquí
    
    this.isDialogVisibleEdit = false; // Cierra el cuadro de diálogo
  }

//==========================================
//Logica para eliminar a un cliente
isDeleteDialogVisible = false;
deleteClientId: number = 0;
  deleteClient(clientId: number){
    this.deleteClientId = clientId;
    this.isDeleteDialogVisible = true;
  }
  confirmDelete(){
    this.isDeleteDialogVisible = false;
    this.loadingPopup = true; // Popup de cargando
    //Eliminar cliente
    this.clientService.deleteCustomer(this.deleteClientId).subscribe((data: any) => {
      this.loadingPopup = false;
      //Eliminar cliente del arreglo
      for (let i = 0; i < this.users.length; i++) {
        if (this.users[i].clientId == this.deleteClientId) {
          this.users.splice(i, 1);
        }
      }
      //Eliminar cliente del arreglo filtrado
      for (let i = 0; i < this.usersFilter.length; i++) {
        if (this.usersFilter[i].clientId == this.deleteClientId) {
          this.usersFilter.splice(i, 1);
          //Actualizar la lista de clientes
          this.total--;
          this.onInputChange();
        }
      }
    });
  }
  cancelDelete(){
    // Cancela la eliminación aquí
    this.isDeleteDialogVisible = false; // Cierra el cuadro de diálogo
  }


}
