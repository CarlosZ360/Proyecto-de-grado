import { Component, input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ClientService } from '../../service/client.service';
import { CompanyService } from '../../service/company.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css'
})
export class CustomersComponent {

  constructor(private router: Router, private clientService: ClientService, private companyService: CompanyService) { 
    const rol = localStorage.getItem('rol');
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');
    if(rol == 'ADMINISTRADOR' || rol == 'CONSULTOR') {
      
    } else if (rol == 'CLIENTE') {
      window.alert('No tienes permisos para acceder a esta página');
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

  //Logica para la paginación - arreglar****
  users: any[] = [];
  //Usuarios filtrados
  usersFilter: any[] = [];

  ngOnInit(){
    this.filteredCustormers = this.customer;
    this.total = this.users.length;
    //Obtener lista de clientes
    this.companyService.getCompanys().subscribe((data: any) => {
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

  //Función para redireccionar a estadisticas de cliente
  statsCustomer(customer: any){
    this.router.navigate(['/stats', customer, ]);
  }
}
