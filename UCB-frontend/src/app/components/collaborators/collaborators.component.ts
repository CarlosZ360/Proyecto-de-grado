import { Component,ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CollaboratorService } from '../../service/collaborator.service';


@Component({
  selector: 'app-collaborators',
  templateUrl: './collaborators.component.html',
  styleUrl: './collaborators.component.css'
})
export class CollaboratorsComponent {

  constructor(private router: Router, private collaboratorService: CollaboratorService) { 
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

  //Variables del popup
  name:string = '';
  lastName:string = '';
  phone:string = '';
  email:string = '';
  role:string = 'ADMINISTRADOR';
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
    //Obtener lista de colaboradores
    this.collaboratorService.getCollaborators().subscribe((data: any) => {
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

  }

  //Función para buscar clientes
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

  //===========================================================================================================================
  //Logica para el popup
  //Función para nueva auditoria
  isDialogVisible = false;
  newRecord(){
   //  this.userId = userId;
   this.isDialogVisible = true;
  }

 confirm(){
  //Validar que los campos no esten vacios
  if (this.name !='' && this.lastName != '' && this.phone != '' && this.email != '' && this.role != '' && this.password != '') {
    this.isDialogVisible = false; // Cierra el cuadro de diálogo
    this.loadingPopup = true; // Popup de cargando
    // Crear un nuevo colaborador aquí
    this.collaboratorService.createCollaborator(this.name, this.lastName, this.phone, this.email, this.password, this.role).subscribe((data: any) => {
      
      // Agregar al arreglo
      this.users.push({employeeId: data.data, name: this.name, lastName: this.lastName, phone: this.phone, email: this.email, role: this.role, password: this.password});
      this.total++;
      // Limpiar campos
      this.name = '';
      this.lastName = '';
      this.phone = '';
      this.email = '';
      this.role = 'ADMINISTRADOR';
      this.password = '';
      //En caso de que en el filtrado estes al final de la lista, agregar a su arreglo y actualizar
      if (this.usersFilter.length < this.inputValue2) {
        this.usersFilter.push({clientId: data.data , name: this.name, lastName: this.lastName, phone: this.phone, email: this.email, role: this.role, password: this.password});
        this.onInputChange();
      }        
      if(data.success == true){
        this.loadingPopup = false;
        this.confirmationPopup = true;
      }else{
        this.loadingPopup = false;
        this.errorPopup = true;
      }
    },
    (error) => {
      
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

 cancel() {
   // Cancela la eliminación aquí
   
   this.isDialogVisible = false; // Cierra el cuadro de diálogo
 }  
  //===========================================================================================================================
  //Logica para editar a un colaborador
  editDialogVisible = false;
  collaboratorId: number = 0; 

    //Asigar los valores actuales al formulario
    editName:string = '';
    editLastName:string = '';
    editPhone:string = '';
    editEmail:string = '';
    editRole:string = '';
    editPassword:string = ''

  editCollaborator(collaboratorId: number){
    this.editDialogVisible = true;
    this.collaboratorId = collaboratorId;
    
    //Asigar data al formulario
    this.users.forEach((element: any) => {
      if (element.employeeId == collaboratorId) {
        this.editName = element.name;
        this.editLastName = element.lastName;
        this.editPhone = element.phone;
        this.editEmail = element.email;
        this.editRole = element.role;
      }
    });
  }


  confirmEdit(){
    //Validar que los campos no esten vacios
    if (this.editName !='' && this.editLastName != '' && this.editPhone != '' && this.editEmail != '' && this.editRole != '') {
      this.editDialogVisible = false;
      this.loadingPopup = true; // Popup de cargando
      //Actualizar colaborador en el arreglo
      this.users.forEach((element: any) => {
        if (element.employeeId == this.collaboratorId) {
          element.name = this.editName;
          element.lastName = this.editLastName;
          element.phone = this.editPhone;
          element.email = this.editEmail;
          element.role = this.editRole;
          element.password = this.editPassword;
        }
      });

      //Actualizar colaborador en la base de datos
      this.collaboratorService.editCollaborator(this.collaboratorId, this.editName, this.editLastName, this.editPhone, this.editEmail, this.editPassword, this.editRole).subscribe((data: any) => {
        this.loadingPopup = false;
      });
      if(this.editPassword != ''){
        this.collaboratorService.updatePassword(this.editEmail, this.editPassword).subscribe((data: any) => {
        this.loadingPopup = false;
        });
      }


      this.editName = '';
      this.editLastName = '';
      this.editPhone = '';
      this.editEmail = '';
      this.editRole = '';
      this.editPassword = '';
    }else{
      
      //Mostrar mensaje de error
      this.errorMessage.nativeElement.classList.add('show');
      setTimeout(() => {
        this.errorMessage.nativeElement.classList.remove('show');
      }, 2000);
    }
  }
  cancelEdit(){
    // Cancela la eliminación aquí
    
    this.editDialogVisible = false; // Cierra el cuadro de diálogo
  }



}
