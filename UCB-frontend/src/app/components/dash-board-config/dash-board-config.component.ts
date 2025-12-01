import { Component, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { ReportService } from '../../service/report.service';

@Component({
  selector: 'app-dash-board-config',
  templateUrl: './dash-board-config.component.html',
  styleUrl: './dash-board-config.component.css'
})
export class DashBoardConfigComponent {

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

  opcion1Checked: boolean = false;
  opcion2Checked: boolean = false;
  opcion3Checked: boolean = false;
  opcion4Checked: boolean = false;

  ngOnInit() {
    //Obtener configuración
    this.reportService.getDashboard().subscribe((data: any) => {
      
      if(data.success == true){
        this.opcion1Checked = data.data.five;
        this.opcion2Checked = data.data.thirteen;
        this.opcion3Checked = data.data.twenty;
        this.opcion4Checked = data.data.state;
      } else {
        this.errorPopup = true;
      }
    });
  }

  //===========================================================================================================================
  save(){
    //Guardar configuración
    this.loadingPopup = true;
    this.reportService.postDashboard(this.opcion1Checked, this.opcion2Checked, this.opcion3Checked, this.opcion4Checked).subscribe((data: any) => {
      if(data.success == true){
        this.loadingPopup = false;
        this.confirmationPopup = true;
      } else {
        this.loadingPopup = false;
        this.errorPopup = true;
      }
    });
    
  }
}
