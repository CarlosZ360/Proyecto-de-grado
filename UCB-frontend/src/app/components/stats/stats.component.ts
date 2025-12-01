import { Component, ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from '../../service/company.service';
import { Chart, ChartType } from 'chart.js/auto';


@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.css'
})
export class StatsComponent {
  


  constructor(private route: ActivatedRoute, private companyService: CompanyService, private router: Router) {
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
  hashes: number = 0;
  crackeds: number = 0;
  id: number = 0;
  chart: any;
  proportionHash: number = 0;



  ngOnInit() {

    this.route.params.subscribe(params => {
      this.id = params['company'];
    });

    //Obtener configuración
    this.companyService.getStats(this.id).subscribe((data: any) => {
        if(data.success == true){
          this.name = data.data.name;
          this.hashes = data.data.hashes;
          this.crackeds = data.data.cracked;
          this.proportionHash = Math.round((this.crackeds / this.hashes) * 10000) / 100;
          this.initializeCharts(this.hashes, this.crackeds);
        } else {
          this.errorMessage.nativeElement.innerHTML = data.message;
        }
    });

   

  }

  initializeCharts(hashesNoCracked:number, hashesCracked:number) {
    this.chart = new Chart('doughnutChartCanvas', {
      type: 'doughnut',
      data: {
        labels: ['Hashes procesados', 'Hashes crackeados'],
        datasets: [{
          label: 'My First Dataset',
          data: [hashesNoCracked, hashesCracked],
          backgroundColor: ['rgb(54, 162, 235)', 'rgb(255, 99, 132)'],
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          }
        },
        layout: {
          padding: {
            left: 1,
            right: 1,
            top: 1,
            bottom: 1
          }
        },
        elements: {
          arc: {
            borderWidth: 0
          }
        },
        cutout: '50%', // Ajusta el tamaño del corte del gráfico de dona
      }
  });

}

  
}
