import { Component,ViewChild } from '@angular/core';
import { ClientService } from '../../service/client.service';
import { CollaboratorService } from '../../service/collaborator.service';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';


@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.css'
})
export class MyProfileComponent {

  @ViewChild('errorMessage') errorMessage: any;

  user: any = [];
  constructor(private router:Router,private clientService: ClientService, private collaboratorService: CollaboratorService) { 

    const rol = localStorage.getItem('rol');
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');
    if (!token || !rol) {
      this.router.navigate(['/login']);
    }

  }


  name:string = '';
  lastName:string = '';
  phone:string = '';
  email:string = '';
  password:string = '';
  //Cambio contraseña
  newPassword:string = '';
  confirmPassword:string = '';
  id: number = 0;

  // Popup de confirmación
  confirmationPopup = false;
  // Popup de error
  errorPopup = false;
  // Popup de cargando
  loadingPopup = false;

  ngOnInit(){
    const id = localStorage.getItem('id');
    const rol = localStorage.getItem('rol');
  
    if (rol == 'ADMINISTRADOR' || rol == 'CONSULTOR') {
      //Obtener datos
      this.collaboratorService.getCollaboratorById(Number(id)).subscribe((data: any) => {
        this.user = data.data;
        
        this.name = this.user.name;
        this.lastName = this.user.lastName;
        this.phone = this.user.phone;
        this.email = this.user.email;
        this.password = this.user.password;
      });      
      

    } else {

      if (id) {
        const secretKey = 'Dr34ml4b';
        // Descifrar el valor cifrado utilizando AES
        const bytes = CryptoJS.AES.decrypt(id, secretKey);
        const decryptedAuditIdString = bytes.toString(CryptoJS.enc.Utf8);
    
        // Convertir la cadena de texto descifrada de vuelta a número
        this.id  = parseInt(decryptedAuditIdString, 10);
      }
      //Obtener datos
      this.clientService.getCustomerById(Number(this.id)).subscribe((data: any) => {
        this.user = data.data;
        
        this.name = this.user.name;
        this.lastName = this.user.lastName;
        this.phone = this.user.phone;
        this.email = this.user.email;
        this.password = this.user.password;
      });

    }
  }

  //Función para cambio de contraseña
  isDialogVisible = false;
  newRecord(){
    //  this.userId = userId;
   this.isDialogVisible = true;
  }

 confirm() {
  //Validar que los campos no esten vacios
    if (this.name !='' && this.lastName != '' && this.phone != '' && this.email != '' && this.password != '') {
      this.isDialogVisible = false; // Cierra el cuadro de diálogo
      this.loadingPopup = true; // Popup de cargando
      //Actualizar datos
      if(this.user.role == 'ADMINISTRADOR' || this.user.role == 'CONSULTOR'){
        this.collaboratorService.editCollaborator(this.user.employeeId, this.name, this.lastName, this.phone, this.email, this.password, this.user.role).subscribe((data: any) => {
          if(data.success == true){
            this.loadingPopup = false;
            this.confirmationPopup = true;
          }else{
            this.loadingPopup = false;
            this.errorPopup = true;
          }
        }, (error) => {
          this.loadingPopup = false;
          this.errorPopup = true;
        }
      );
      } else {
        this.clientService.updateCustomer(this.user.clientId, this.name, this.lastName, this.phone, this.email, this.user.companyId, this.user.position ,this.password).subscribe((data: any) => {
          if(data.success == true){
            this.loadingPopup = false;
            this.confirmationPopup = true;
          }else{
            this.loadingPopup = false;
            this.errorPopup = true;
          }
        }, (error) => {
          this.loadingPopup = false;
          this.errorPopup = true;
        }
      );
      }

    }else{
      
      //Mostrar mensaje de error
      this.errorMessage.nativeElement.classList.add('show');
      setTimeout(() => {
        this.errorMessage.nativeElement.classList.remove('show');
      }, 2000);
    }
  }

  editPassword(){
   //Verificar que no esten vacios
    if (this.newPassword != '' && this.confirmPassword != '') {
      //Verificar que las contraseñas sean iguales
      if (this.newPassword == this.confirmPassword) {
        this.loadingPopup = true; // Popup de cargando
        //Actualizar contraseña
        if(this.user.role == 'ADMINISTRADOR' || this.user.role == 'CONSULTOR'){
          this.collaboratorService.updatePassword(this.user.email, this.newPassword).subscribe((data: any) => {
            
            if(data.success == true){
              this.isDialogVisible = false; // Cierra el cuadro de diálogo
              this.loadingPopup = false;
              this.confirmationPopup = true;
            }else{
              this.isDialogVisible = false; // Cierra el cuadro de diálogo
              this.loadingPopup = false;
              this.errorPopup = true;
            }
            }, (error) => {
            this.loadingPopup = false;
            this.errorPopup = true;
          }
        );
          //Limpiar campos contraseña
          this.newPassword = '';
          this.confirmPassword = '';
          
        } else {
          this.clientService.updatePassword(this.user.email, this.newPassword).subscribe((data: any) => {
            if(data.success == true){
              this.isDialogVisible = false; // Cierra el cuadro de diálogo
              this.loadingPopup = false;
              this.confirmationPopup = true;
            }else{
              this.isDialogVisible = false; // Cierra el cuadro de diálogo
              this.loadingPopup = false;
              this.errorPopup = true;
            }
          }, (error) => {
            this.loadingPopup = false;
            this.errorPopup = true;
          }
        );
          //Limpiar campos contraseña
          this.newPassword = '';
          this.confirmPassword = '';
        }
      }else{
        
        //Mostrar mensaje de error
        this.errorMessage.nativeElement.classList.add('show');
        setTimeout(() => {
          this.errorMessage.nativeElement.classList.remove('show');
        }, 2000);
      }
    }else{
      
      //Mostrar mensaje de error
      this.errorMessage.nativeElement.classList.add('show');
      setTimeout(() => {
        this.errorMessage.nativeElement.classList.remove('show');
      }, 2000);
    }
   this.isDialogVisible = true;
  }  
  popup(){
    this.isDialogVisible = true; // Cierra el cuadro de diálogo
  }
  cancel(){
   // Cancela la eliminación aquí
   this.isDialogVisible = false; // Cierra el cuadro de diálogo
  }  


}
