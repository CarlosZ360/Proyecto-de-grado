import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import * as jwt_decode from 'jwt-decode';
import { CollaboratorService } from '../../service/collaborator.service';
import * as CryptoJS from 'crypto-js';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  
})
export class LoginComponent {

    constructor(private router: Router, private collaboratorService: CollaboratorService) { }

    //Variables para el login
    email:string = '';
    password:string = '';
    @ViewChild('errorMessage') errorMessage: any;
    @ViewChild('errorMessageLogin') errorMessageLogin: any;
    
  
    login() {
      if (this.email !='' && this.password != '') {
        this.collaboratorService.postLogin(this.email, this.password).subscribe(
          (response: any) => {
            
            if(response.success) {
              const token = response.data.token;
              const rol = this.getRol(token).toUpperCase();
              
              const id = this.getId(token).toUpperCase();
              if(rol == "ADMINISTRADOR" || rol == "CONSULTOR"){
                localStorage.setItem('token', token);
                localStorage.setItem('rol', rol);
                localStorage.setItem('id', id);
                
                window.location.href = '/customers';
              }else {
                localStorage.setItem('token', token);
                const rolToken = this.encryptData(rol);
                localStorage.setItem('rol', rolToken);
                const idToken = this.encryptData(id);
                localStorage.setItem('id', idToken);
                window.location.href = '/audit';
              }
            } else {
              this.errorMessageLogin.nativeElement.classList.add('show');
              setTimeout(() => {
                this.errorMessageLogin.nativeElement.classList.remove('show');
              }, 2000);
            }
          }
        );
      } else {  
        this.errorMessage.nativeElement.classList.add('show');
        setTimeout(() => {
          this.errorMessage.nativeElement.classList.remove('show');
        }, 2000);
      }
    }
    //Función para obtener el rol del token
    getRol(token: string) {
      try {
        const payload: any = jwt_decode.jwtDecode(token);
        if (payload && payload.rol) {
          return payload.rol;
        } else {
          return null;
        }
      } catch (error) {
        console.error('Error al decodificar el token JWT', error);
        return null;
      }
    }
    //Función para obtener el id del token
    getId(token: string) {
      try {
        const payload: any = jwt_decode.jwtDecode(token);
        if (payload && payload.sub) {
          return payload.sub;
        } else {
          return null;
        }
      } catch (error) {
        console.error('Error al decodificar el token JWT', error);
        return null;
      }
    }

  //Función para cifrar
  encryptData(auditId: string): string {
    // Clave secreta utilizada para el cifrado
    const secretKey = 'Dr34ml4b'
    // Convertir el número a una cadena de texto
    const auditIdString = auditId.toString();
    // Cifrar la cadena de texto utilizando AES
    const encryptedAuditId = CryptoJS.AES.encrypt(auditIdString, secretKey).toString();
    return encryptedAuditId;
  }    
}
