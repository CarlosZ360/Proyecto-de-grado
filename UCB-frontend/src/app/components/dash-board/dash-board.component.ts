import { Component } from '@angular/core';
import { Chart, ChartType } from 'chart.js/auto';
import { ReportService } from '../../service/report.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from '../../service/client.service';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'
import { CompanyService } from '../../service/company.service';

@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrl: './dash-board.component.css'
})
export class DashBoardComponent {

  constructor(private reportService:ReportService, private router:Router, private route: ActivatedRoute, private clientService:ClientService, private companyService:CompanyService){


  }

  chart: any;
  barra: any;
  //Variables para el reporte
  hashes:number = 0;
  //fecha
  date: string = '';

  //Variable para grafico de barras
  lengthOne: number = 0;
  lengthTwo: number = 0;
  lengthThree: number = 0;
  lengthFour: number = 0;
  //Variable archivo
  fileCrackedHashes: string = "";
  fileCrackedPotfile: string = "";
  id: number = 0;
  customerId: number = 0;
  cliente: any = [];
  //Variables para las tablas
  empty: number = 0;
  numeric: number = 0;
  alpha: number = 0;
  alphaNumeric: number = 0;
  alphaSpecial: number = 0;
  numericSpecial: number = 0;
  alphaNumericSpecial: number = 0;
  //Palabras mas usadas
  words: any = [];
  wordTop1: string = '';
  wordTop1Count: number = 0;
  wordTop2: string = '';
  wordTop2Count: number = 0;
  wordTop3: string = '';
  wordTop3Count: number = 0;
  wordTop4: string = '';
  wordTop4Count: number = 0;
  wordTop5: string = '';
  wordTop5Count: number = 0;
  wordTop6: string = '';
  wordTop6Count: number = 0;
  wordTop7: string = '';
  wordTop7Count: number = 0;
  wordTop8: string = '';
  wordTop8Count: number = 0;
  wordTop9: string = '';
  wordTop9Count: number = 0;
  wordTop10: string = '';
  wordTop10Count: number = 0;
  //Palabras base mas usadas
  baseWords: any = [];
  baseWordTop1: string = '';
  baseWordTop1Count: number = 0;
  baseWordTop2: string = '';
  baseWordTop2Count: number = 0;
  baseWordTop3: string = '';
  baseWordTop3Count: number = 0;
  baseWordTop4: string = '';
  baseWordTop4Count: number = 0;
  baseWordTop5: string = '';
  baseWordTop5Count: number = 0;
  baseWordTop6: string = '';
  baseWordTop6Count: number = 0;
  baseWordTop7: string = '';
  baseWordTop7Count: number = 0;
  baseWordTop8: string = '';
  baseWordTop8Count: number = 0;
  baseWordTop9: string = '';
  baseWordTop9Count: number = 0;
  baseWordTop10: string = '';
  baseWordTop10Count: number = 0;
  //Top 10 de mascaras base
  masks: any = [];
  maskTop1: string = '';
  maskTop1Count: number = 0;
  maskTop2: string = '';
  maskTop2Count: number = 0;
  maskTop3: string = '';
  maskTop3Count: number = 0;
  maskTop4: string = '';
  maskTop4Count: number = 0;
  maskTop5: string = '';
  maskTop5Count: number = 0;
  maskTop6: string = '';
  maskTop6Count: number = 0;
  maskTop7: string = '';
  maskTop7Count: number = 0;
  maskTop8: string = '';
  maskTop8Count: number = 0;
  maskTop9: string = '';
  maskTop9Count: number = 0;
  maskTop10: string = '';
  maskTop10Count: number = 0;

  ngOnInit() {

    //Obtener reporte final
    this.reportService.getDashboard().subscribe((data: any) => {
      console.log(data);
      
      //Valores cabezera y tablas
      this.hashes = data.data.countHashes


      //Variblaes para el grafico de barras
      this.lengthOne = data.data.lengthOne
      this.lengthTwo = data.data.lengthTwo
      this.lengthThree = data.data.lengthThree
      this.lengthFour = data.data.lengthFour

      //Inicializar graficos
      this.initializeCharts(this.lengthOne, this.lengthTwo, this.lengthThree, this.lengthFour);

      //Variables para las tablas
      this.empty = data.data.empty
      this.numeric = data.data.numeric
      this.alpha = data.data.alpha
      this.alphaNumeric = data.data.alphaNumeric
      this.alphaSpecial = data.data.alphaSpecial
      this.numericSpecial = data.data.numericSpecial
      this.alphaNumericSpecial = data.data.alphaNumericSpecial

      //Palabras mas usadas
      this.words = data.data.mostWord
      
      //El fortato de words es "hash2: 2,password: 2,hash1: 1,: 1,123456: 1,Test octubre: 1,Test noviembre: 1,Test diciembre: 1,Test#: 1,23@: 1,Test#23: 1"
      //Se debe separar por comas y dos puntos
      let wordsSplit = this.words.split(',');
      //Separar por dos puntos
      let wordsSplit2 = [];
      for(let i = 0; i < wordsSplit.length; i++){
        let split = wordsSplit[i].split(':');
        wordsSplit2.push(split);
      }
      // Asignar valores
      this.wordTop1 = wordsSplit2[0] ? wordsSplit2[0][0] : '-';
      this.wordTop1Count = wordsSplit2[0] ? wordsSplit2[0][1] : '-';
      this.wordTop2 = wordsSplit2[1] ? wordsSplit2[1][0] : '-';
      this.wordTop2Count = wordsSplit2[1] ? wordsSplit2[1][1] : '-';
      this.wordTop3 = wordsSplit2[2] ? wordsSplit2[2][0] : '-';
      this.wordTop3Count = wordsSplit2[2] ? wordsSplit2[2][1] : '-';
      this.wordTop4 = wordsSplit2[3] ? wordsSplit2[3][0] : '-';
      this.wordTop4Count = wordsSplit2[3] ? wordsSplit2[3][1] : '-';
      this.wordTop5 = wordsSplit2[4] ? wordsSplit2[4][0] : '-';
      this.wordTop5Count = wordsSplit2[4] ? wordsSplit2[4][1] : '-';
      this.wordTop6 = wordsSplit2[5] ? wordsSplit2[5][0] : '-';
      this.wordTop6Count = wordsSplit2[5] ? wordsSplit2[5][1] : '-';
      this.wordTop7 = wordsSplit2[6] ? wordsSplit2[6][0] : '-';
      this.wordTop7Count = wordsSplit2[6] ? wordsSplit2[6][1] : '-';
      this.wordTop8 = wordsSplit2[7] ? wordsSplit2[7][0] : '-';
      this.wordTop8Count = wordsSplit2[7] ? wordsSplit2[7][1] : '-';
      this.wordTop9 = wordsSplit2[8] ? wordsSplit2[8][0] : '-';
      this.wordTop9Count = wordsSplit2[8] ? wordsSplit2[8][1] : '-';
      this.wordTop10 = wordsSplit2[9] ? wordsSplit2[9][0] : '-';
      this.wordTop10Count = wordsSplit2[9] ? wordsSplit2[9][1] : '-';

      //Palabras base
      this.baseWords = data.data.mostWordBase
      
      //El formato de palabras base es "Test: 3,hash2: 2,password: 2,hash1: 1,: 1,123456: 1,Test#: 1,23@: 1,Test#23: 1"
      //Se debe separar por comas y dos puntos
      let baseWordsSplit = this.baseWords.split(',');
      
      //Separar por dos puntos
      let baseWordsSplit2 = [];
      for(let i = 0; i < baseWordsSplit.length; i++){
        let split = baseWordsSplit[i].split(':');
        baseWordsSplit2.push(split);
      }
      
      // Asignar valores
      this.baseWordTop1 = baseWordsSplit2[0] ? baseWordsSplit2[0][0] : '-';
      this.baseWordTop1Count = baseWordsSplit2[0] ? baseWordsSplit2[0][1] : '-';
      this.baseWordTop2 = baseWordsSplit2[1] ? baseWordsSplit2[1][0] : '-';
      this.baseWordTop2Count = baseWordsSplit2[1] ? baseWordsSplit2[1][1] : '-';
      this.baseWordTop3 = baseWordsSplit2[2] ? baseWordsSplit2[2][0] : '-';
      this.baseWordTop3Count = baseWordsSplit2[2] ? baseWordsSplit2[2][1] : '-';
      this.baseWordTop4 = baseWordsSplit2[3] ? baseWordsSplit2[3][0] : '-';
      this.baseWordTop4Count = baseWordsSplit2[3] ? baseWordsSplit2[3][1] : '-';
      this.baseWordTop5 = baseWordsSplit2[4] ? baseWordsSplit2[4][0] : '-';
      this.baseWordTop5Count = baseWordsSplit2[4] ? baseWordsSplit2[4][1] : '-';
      this.baseWordTop6 = baseWordsSplit2[5] ? baseWordsSplit2[5][0] : '-';
      this.baseWordTop6Count = baseWordsSplit2[5] ? baseWordsSplit2[5][1] : '-';
      this.baseWordTop7 = baseWordsSplit2[6] ? baseWordsSplit2[6][0] : '-';
      this.baseWordTop7Count = baseWordsSplit2[6] ? baseWordsSplit2[6][1] : '-';
      this.baseWordTop8 = baseWordsSplit2[7] ? baseWordsSplit2[7][0] : '-';
      this.baseWordTop8Count = baseWordsSplit2[7] ? baseWordsSplit2[7][1] : '-';
      this.baseWordTop9 = baseWordsSplit2[8] ? baseWordsSplit2[8][0] : '-';
      this.baseWordTop9Count = baseWordsSplit2[8] ? baseWordsSplit2[8][1] : '-';
      this.baseWordTop10 = baseWordsSplit2[9] ? baseWordsSplit2[9][0] : '-';
      this.baseWordTop10Count = baseWordsSplit2[9] ? baseWordsSplit2[9][1] : '-';

      //Top 10 de mascaras base
      this.masks = data.data.mostMask
      
      //El formato de palabras base es "Test: 3,hash2: 2,password: 2,hash1: 1,: 1,123456: 1,Test#: 1,23@: 1,Test#23: 1"
      //Se debe separar por comas y dos puntos
      let masksSplit = this.masks.split(',');
      
      //Separar por dos puntos
      let masksSplit2 = [];
      for(let i = 0; i < masksSplit.length; i++){
        let split = masksSplit[i].split(':');
        masksSplit2.push(split);
      }
      
      // Asignar valores
      this.maskTop1 = masksSplit2[0] ? masksSplit2[0][0] : '-';
      this.maskTop1Count = masksSplit2[0] ? masksSplit2[0][1] : '-';
      this.maskTop2 = masksSplit2[1] ? masksSplit2[1][0] : '-';
      this.maskTop2Count = masksSplit2[1] ? masksSplit2[1][1] : '-';
      this.maskTop3 = masksSplit2[2] ? masksSplit2[2][0] : '-';
      this.maskTop3Count = masksSplit2[2] ? masksSplit2[2][1] : '-';
      this.maskTop4 = masksSplit2[3] ? masksSplit2[3][0] : '-';
      this.maskTop4Count = masksSplit2[3] ? masksSplit2[3][1] : '-';
      this.maskTop5 = masksSplit2[4] ? masksSplit2[4][0] : '-';
      this.maskTop5Count = masksSplit2[4] ? masksSplit2[4][1] : '-';
      this.maskTop6 = masksSplit2[5] ? masksSplit2[5][0] : '-';
      this.maskTop6Count = masksSplit2[5] ? masksSplit2[5][1] : '-';
      this.maskTop7 = masksSplit2[6] ? masksSplit2[6][0] : '-';
      this.maskTop7Count = masksSplit2[6] ? masksSplit2[6][1] : '-';
      this.maskTop8 = masksSplit2[7] ? masksSplit2[7][0] : '-';
      this.maskTop8Count = masksSplit2[7] ? masksSplit2[7][1] : '-';
      this.maskTop9 = masksSplit2[8] ? masksSplit2[8][0] : '-';
      this.maskTop9Count = masksSplit2[8] ? masksSplit2[8][1] : '-';
      this.maskTop10 = masksSplit2[9] ? masksSplit2[9][0] : '-';
      this.maskTop10Count = masksSplit2[9] ? masksSplit2[9][1] : '-';

    });

  }

  initializeCharts(lengthOne:number, lengthTwo:number, lengthThree:number, lengthFour:number) {

  const labels = ['0-5', '6-10', '11-15', '16 o más'];
  const data1 = {
  labels: labels,
  datasets: [{
    label: 'Grafico de barras',
    data: [lengthOne, lengthTwo, lengthThree, lengthFour],
    backgroundColor: [
      'rgba(255, 99, 132, 0.2)',
      'rgba(255, 159, 64, 0.2)',
      'rgba(255, 205, 86, 0.2)',
      'rgba(75, 192, 192, 0.2)'
    ],
    borderColor: [
      'rgb(255, 99, 132)',
      'rgb(255, 159, 64)',
      'rgb(255, 205, 86)',
      'rgb(75, 192, 192)'
    ],
    borderWidth: 1
  }]
};

const options = {
  scales: {
    y: {
      position: 'left',
      title: {
        display: true,
        text: 'Cantidad de contraseñas'
      }
    },
    x: {
      position: 'bottom',
      title: {
        display: true,
        text: 'Longitud'
      }
    }
  }
};

this.barra = new Chart('barChartCanvas', {
  type: 'bar',
  data: data1,
  options: {
    scales: {
      y: {
        position: 'left',
        title: {
          display: true,
          text: 'Cantidad de contraseñas'
        }
      },
      x: {
        position: 'bottom',
        title: {
          display: true,
          text: 'Longitud'
        }
      }
    }
  }
});
}
}
