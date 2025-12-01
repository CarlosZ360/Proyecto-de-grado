import { Component } from '@angular/core';
import { ClientService } from '../../service/client.service';
import { CollaboratorService } from '../../service/collaborator.service';
import * as CryptoJS from 'crypto-js';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  dropdownOpen: boolean = false;
  dropdownOpen2: boolean = false;


  admin: boolean = false;
  client: boolean = false;
  consultor: boolean = false;
  user: any = [];
  
  //
  id: number = 0;

  constructor(private clientService: ClientService, private collaboratorService: CollaboratorService) { 
    const id = localStorage.getItem('id');
    const rol = localStorage.getItem('rol');
  
    if (rol == 'ADMINISTRADOR') {
      this.admin = true;
      //Obtener datos
      this.collaboratorService.getCollaboratorById(Number(id)).subscribe((data: any) => {
        this.user = data.data;
        
      });      
      

    } else if(rol == 'CONSULTOR') {
      this.consultor = true;
      //Obtener datos
      this.collaboratorService.getCollaboratorById(Number(id)).subscribe((data: any) => {
        this.user = data.data;
        
      });      

    }else {
    //Asignar el valor del id del cliente del toke
    if (id) {
      const secretKey = 'Dr34ml4b';
      // Descifrar el valor cifrado utilizando AES
      const bytes = CryptoJS.AES.decrypt(id, secretKey);
      const decryptedAuditIdString = bytes.toString(CryptoJS.enc.Utf8);
  
      // Convertir la cadena de texto descifrada de vuelta a número
      this.id  = parseInt(decryptedAuditIdString, 10);
    }

      this.client = true;
      //Obtener datos
      this.clientService.getCustomerById(Number(this.id)).subscribe((data: any) => {
        this.user = data.data;
        

      });

    }
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }
  toggleDropdown2() {
    this.dropdownOpen2 = !this.dropdownOpen2;
  }
  //=======================================================================
  //Logica del popup
  isDialogVisible = false;

  popup(){
    this.isDialogVisible = true;
  }
  closeSesion(){
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('id');
    window.location.href = '/login';
  }
  cancel(){
    this.isDialogVisible = false;
  }


}
