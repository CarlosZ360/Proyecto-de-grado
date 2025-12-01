import { Component, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { ReportService } from '../../service/report.service';


@Component({
  selector: 'app-hash',
  templateUrl: './hash.component.html',
  styleUrl: './hash.component.css'
})
export class HashComponent {

  constructor(private router: Router, private reportService: ReportService) {
    const rol = localStorage.getItem('rol');
    const id = localStorage.getItem('id');
    if(rol == 'ADMINISTRADOR') {
      
    } else if (rol == 'CLIENTE' || rol == 'CONSULTOR') {
      window.alert('No tienes permisos para acceder a esta página');
    } else {
      window.alert('No has iniciado sesión');
      this.router.navigate(['/login']);
    }
    
  }

  @ViewChild('errorMessage') errorMessage: any;

  //Variables
  name:string = '';
  file:string = '';

  // Popup de confirmación
  confirmationPopup = false;
  // Popup de error
  errorPopup = false;
  // Popup de cargando
  loadingPopup = false;

  //===========================================================================================================================
  //Logica para cargado de archivo .txt
  importFile: File = new File([""], "archivo");
  onFileChange(event: any) {
    const file: File = event.target.files[0];
    this.importFile = file;
    
    this.file = file.name;
    //this.uploadFile(file);

  }
  uploadFile() {
    //Validar que se halla seleccionado un archivo
    if(this.file != ''){
      this.loadingPopup = true;
      this.reportService.postPotfile(this.importFile).subscribe((data: any) => {
        if(data.success == true){
          this.loadingPopup = false;
          this.confirmationPopup = true;
        } else {
          this.loadingPopup = false;
          this.errorPopup = true;
        }
      });
    } else{
      //Mostrar mensaje de error
      this.errorMessage.nativeElement.classList.add('show');
      setTimeout(() => {
        this.errorMessage.nativeElement.classList.remove('show');
      }, 2000);
    }
  }
  dowloadFile(){
    this.loadingPopup = true;
    this.reportService.getHashes().subscribe((data: any) => {
      if(data.success == true){
        this.loadingPopup = false;
        this.confirmationPopup = true;
        //Descargar el contenido del archivo
        const contenidoDecodificado = atob(data.data);
        const contenidoTexto = this.utf8Decode(contenidoDecodificado);
        const blob = new Blob([contenidoTexto], { type: 'text/plain' });
        const enlaceDescarga = document.createElement('a');
        enlaceDescarga.href = URL.createObjectURL(blob);
        enlaceDescarga.download = 'hashes.txt';
        enlaceDescarga.click();
        URL.revokeObjectURL(enlaceDescarga.href);

      } else {
        this.loadingPopup = false;
        this.errorPopup = true;
      }
    });
  }
    // Función para decodificar una cadena UTF-8
    utf8Decode(encodedString: string): string {
      const decodedString = decodeURIComponent(escape(encodedString));
      return decodedString;
    }
}


