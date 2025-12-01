import { Component } from '@angular/core';
import { Chart, ChartType } from 'chart.js/auto';
import { ReportService } from '../../service/report.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from '../../service/client.service';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'
import { CompanyService } from '../../service/company.service';



@Component({
  selector: 'app-view-final-report',
  templateUrl: './view-final-report.component.html',
  styleUrl: './view-final-report.component.css'
})
export class ViewFinalReportComponent {

  constructor(private reportService:ReportService, private router:Router, private route: ActivatedRoute, private clientService:ClientService, private companyService:CompanyService){}

  chart: any;
  barra: any;
  //Variables para el reporte
  hashesDump:number = 0;
  hashesPotfile:number = 0;
  hashes:number = 0;
  hashesCracked:number = 0;
  proportionHash:number = 0;
  hashesNoCracked:number = 0;
  reportId: number = 0;
  reportFinalId: number = 0;
  observation: string = '';
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
    //Obtener id del reporte final
    this.route.params.subscribe(params => {
      this.reportFinalId = params['final'];
    });

    //Obtener id del reporte
    this.route.params.subscribe(params => {
      this.reportId = params['report'];
    });
    //Obtener id de la auditoria
    this.route.params.subscribe(params => {
      this.id = params['audit'];
    });
    //Obtener id del cliente
    this.route.params.subscribe(params => {
      this.customerId = params['customer'];
    });

    //Obtener informacion del cliente 
    this.companyService.getCompanyById(this.customerId).subscribe((data: any) => {
      
      this.cliente = data.data;
    });
    //Obtener reporte final
    this.reportService.getReportFinal(this.reportFinalId).subscribe((data: any) => {

      //Valores cabezera y tablas
      this.hashesDump = data.data.countHashesDumps
      this.hashesPotfile = data.data.countHashesPotfile
      this.hashes = data.data.countHashes
      this.hashesCracked = data.data.countCracked
      this.observation = data.data.observation

      //Fecha del reporte final
      this.date = data.data.date.slice(0, 10)

      this.hashesNoCracked = this.hashesDump - this.hashesCracked
      //Variblaes para el grafico de barras
      this.lengthOne = data.data.lengthOne
      this.lengthTwo = data.data.lengthTwo
      this.lengthThree = data.data.lengthThree
      this.lengthFour = data.data.lengthFour

      //Sacar el porcentaje de hashes crackeados
      this.proportionHash = Math.round((this.hashesCracked / this.hashesDump) * 10000) / 100;
      this.initializeCharts(this.hashesNoCracked, this.hashesCracked, this.lengthOne, this.lengthTwo, this.lengthThree, this.lengthFour);

      //Asignar valores a los archivos
      this.fileCrackedHashes = data.data.fileCrackedHashes
      this.fileCrackedPotfile = data.data.fileCrackedPotfile

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

  initializeCharts(hashesNoCracked:number, hashesCracked:number, lengthOne:number, lengthTwo:number, lengthThree:number, lengthFour:number) {
        this.chart = new Chart('doughnutChartCanvas', {
          type: 'doughnut',
          data: {
            labels: ['Hashes no crackeados', 'Hashes crackeados'],
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
  //Descargar archivo hashes
  DownloadHashes() {
    
    
    // Decodificar el contenido del archivo
    const contenidoDecodificado = atob(this.fileCrackedHashes);
    // Convertir la cadena decodificada a UTF-8
    const contenidoTexto = this.utf8Decode(contenidoDecodificado);
  
    // Crear un Blob con el contenido decodificado
    const blob = new Blob([contenidoTexto], { type: 'text/plain' });
  
    // Crear un enlace de descarga
    const enlaceDescarga = document.createElement('a');
    enlaceDescarga.href = URL.createObjectURL(blob);
    // Asignar el nombre del archivo con nombre cliente y fecha
    enlaceDescarga.download = this.cliente.name + '-' + new Date().toLocaleDateString() + '.cracked';
    //enlaceDescarga.download = 'cliente-fecha.cracked';
  
    // Simular un clic en el enlace de descarga para iniciar la descarga
    enlaceDescarga.click();
  
    // Limpiar el objeto URL creado para el Blob
    URL.revokeObjectURL(enlaceDescarga.href);
  }

  //Descargar archivo dumps
  DownloadDump() {
    
    
    // Decodificar el contenido del archivo
    const contenidoDecodificado = atob(this.fileCrackedPotfile);
    // Convertir la cadena decodificada a UTF-8
    const contenidoTexto = this.utf8Decode(contenidoDecodificado);
  
    // Crear un Blob con el contenido decodificado
    const blob = new Blob([contenidoTexto], { type: 'text/plain' });
  
    // Crear un enlace de descarga
    const enlaceDescarga = document.createElement('a');
    enlaceDescarga.href = URL.createObjectURL(blob);
    // Asignar el nombre del archivo con nombre cliente y fecha
    enlaceDescarga.download = this.cliente.name + '-' + new Date().toLocaleDateString() + '.dump';
    //enlaceDescarga.download = 'cliente-fecha.cracked';
  
    // Simular un clic en el enlace de descarga para iniciar la descarga
    enlaceDescarga.click();
  
    // Limpiar el objeto URL creado para el Blob
    URL.revokeObjectURL(enlaceDescarga.href);
  }
  
  // Función para decodificar una cadena UTF-8
  utf8Decode(encodedString: string): string {
    const decodedString = decodeURIComponent(escape(encodedString));
    return decodedString;
  }

  
  //===========================================================================================================================
  //Logica para cargado de archivo .txt
  importFile: File = new File([""], "archivo");
  file:string = '';
  onFileChange(event: any) {
    const file: File = event.target.files[0];
    this.importFile = file;
    
    this.file = file.name;
    //this.uploadFile(file);
  }
  //Popup
  isDialogVisible = false;
  newReport(){
    
    this.isDialogVisible = true;
  }
  createReport(){
    this.reportService.postReport(this.importFile, this.id).subscribe((data: any) => {
      
      this.isDialogVisible = false;
    });
  }
  cancel(){
    this.isDialogVisible = false;
  }
  //===========================================================================================================================
  //Exportar PDF


  exportPDF(){
    // Primera pagina
    
    const pdf = new jsPDF();

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(20);
    pdf.setTextColor('#000000');
    pdf.text('PASSWORD CRACKING', 65, 25);

    pdf.setFontSize(13);
    // pdf.setTextColor('#5F5F5F');
    // Datos del registro
    pdf.text('Datos generales', 15, 40);
    autoTable(pdf, {
      theme: 'striped',
      startY: 45,
      headStyles: {
        fillColor: [22, 66, 136],
        textColor: [255, 255, 255],
        fontStyle: 'bold', // Estilo de fuente
        fontSize: 12, // Tamaño de fuente
      },
      bodyStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0], // Color de texto en formato
        fontStyle: 'bold', // Estilo de fuente
        fontSize: 12, // Tamaño de fuente
      },
      head: [['Total de hashes procesados', 'Porcentaje de credenciales obtenidas']],
      body: [[this.hashesDump, this.proportionHash]],
    });

    // Datos de los hashes
    autoTable(pdf, {
      theme: 'striped',
      startY: 62,
      headStyles: {
        fillColor: [22, 66, 136],
        textColor: [255, 255, 255],
        fontStyle: 'bold', // Estilo de fuente
        fontSize: 12, // Tamaño de fuente
      },
      bodyStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0], // Color de texto en formato
        fontStyle: 'bold', // Estilo de fuente
        fontSize: 12, // Tamaño de fuente
      },
      head: [['Hashes que fueron crackeados', 'Hashes no crackeados']],

      body: [[this.hashesCracked, this.hashesNoCracked]],
      columnStyles: {
        0: {cellWidth: 79},
        1: {cellWidth: 103},
        // etc
      }
     
    });
    
    pdf.text('Gráfico estadístico', 82, 90);
    // Grafico de dona
    // Obtener el gráfico de Chart.js como una imagen base64
    const canvas = document.getElementById('doughnutChartCanvas') as HTMLCanvasElement;
    const imgData = canvas.toDataURL('image/png');

    // Agregar la imagen al PDF
    pdf.addImage(imgData, 'PNG', 10, 95, 190, 100); // Ajusta las coordenadas y el tamaño según sea necesario

    //Grafico de barras
    // Obtener el gráfico de Chart.js como una imagen base64
    const canvas1 = document.getElementById('barChartCanvas') as HTMLCanvasElement;
    const imgData1 = canvas1.toDataURL('image/png');

    // Agregar la imagen al PDF
    pdf.addImage(imgData1, 'PNG', 40, 200, 130, 90); // Ajusta las coordenadas y el tamaño según sea necesario    

    // Segunda pagina
    pdf.addPage();

    //pdf.text('Tabla 1', 15, 10);
    // Datos de formatos de contraseñas
    autoTable(pdf, {
      theme: 'striped',
      startY: 15,
      margin: {left: 50},
      headStyles: {
        fillColor: [22, 66, 136],
        textColor: [255, 255, 255],
        fontStyle: 'bold', // Estilo de fuente
        fontSize: 12, // Tamaño de fuente
      },
      bodyStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0], // Color de texto en formato
        fontStyle: 'bold', // Estilo de fuente
        fontSize: 12, // Tamaño de fuente
      },
      head: [['Formato de contraseñas', 'Cantidad']],

      body: [['Vacio', this.empty], 
      ['Numéricos', this.numeric], 
      ['Alfabéticos', this.alpha], 
      ['Alfa numéricos', this.alphaNumeric], 
      ['Alfabéticos con caracteres especiales', this.alphaSpecial], 
      ['Numéricos con caracteres especiales', this.numericSpecial], 
      ['Alfa numéricos con caracteres especiales', this.alphaNumericSpecial]],
      columnStyles: {
        0: {cellWidth: 70},
        1: {cellWidth: 30},
      },
    }); 

    //pdf.text('Tabla 2', 15, 100);
    //Datos de palabras mas usadas
    autoTable(pdf, {
      theme: 'striped',
      startY: 115,
      margin: {left: 50},
      headStyles: {
        fillColor: [22, 66, 136],
        textColor: [255, 255, 255],
        fontStyle: 'bold', // Estilo de fuente
        fontSize: 12, // Tamaño de fuente
      },
      bodyStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0], // Color de texto en formato
        fontStyle: 'bold', // Estilo de fuente
        fontSize: 12, // Tamaño de fuente
      },
      head: [['Top 10 de contraseñas repetidas', 'Cantidad']],
      body: [[this.wordTop1, this.wordTop1Count], 
      [this.wordTop2, this.wordTop2Count], 
      [this.wordTop3, this.wordTop3Count], 
      [this.wordTop4, this.wordTop4Count], 
      [this.wordTop5, this.wordTop5Count], 
      [this.wordTop6, this.wordTop6Count], 
      [this.wordTop7, this.wordTop7Count], 
      [this.wordTop8, this.wordTop8Count], 
      [this.wordTop9, this.wordTop9Count], 
      [this.wordTop10, this.wordTop10Count]],
      columnStyles: {
        0: {cellWidth: 70},
        1: {cellWidth: 30},
      },
    });

    // Tercera pagina
    pdf.addPage();

    //pdf.text('Tabla 3', 15, 10);
    //Datos de palabras base mas usadas
    autoTable(pdf, {
      theme: 'striped',
      startY: 15,
      margin: {left: 50},
      headStyles: {
        fillColor: [22, 66, 136],
        textColor: [255, 255, 255],
        fontStyle: 'bold', // Estilo de fuente
        fontSize: 12, // Tamaño de fuente
      },
      bodyStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0], // Color de texto en formato
        fontStyle: 'bold', // Estilo de fuente
        fontSize: 12, // Tamaño de fuente
      },
      head: [['Top 10 de palabras base', 'Cantidad']],
      body: [[this.baseWordTop1, this.baseWordTop1Count], 
      [this.baseWordTop2, this.baseWordTop2Count], 
      [this.baseWordTop3, this.baseWordTop3Count], 
      [this.baseWordTop4, this.baseWordTop4Count], 
      [this.baseWordTop5, this.baseWordTop5Count], 
      [this.baseWordTop6, this.baseWordTop6Count], 
      [this.baseWordTop7, this.baseWordTop7Count], 
      [this.baseWordTop8, this.baseWordTop8Count], 
      [this.baseWordTop9, this.baseWordTop9Count], 
      [this.baseWordTop10, this.baseWordTop10Count]],
      columnStyles: {
        0: {cellWidth: 70},
        1: {cellWidth: 30},
      },
    });

    //pdf.text('Tabla 4', 15, 120);
    //Datos de mascaras base mas usadas
    autoTable(pdf, {
      theme: 'striped',
      startY: 125,
      margin: {left: 50},
      headStyles: {
        fillColor: [22, 66, 136],
        textColor: [255, 255, 255],
        fontStyle: 'bold', // Estilo de fuente
        fontSize: 12, // Tamaño de fuente
      },
      bodyStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0], // Color de texto en formato
        fontStyle: 'bold', // Estilo de fuente
        fontSize: 12, // Tamaño de fuente
      },
      head: [['Top 10 de mascaras base', 'Cantidad']],
      body: [[this.maskTop1, this.maskTop1Count], 
      [this.maskTop2, this.maskTop2Count], 
      [this.maskTop3, this.maskTop3Count], 
      [this.maskTop4, this.maskTop4Count], 
      [this.maskTop5, this.maskTop5Count], 
      [this.maskTop6, this.maskTop6Count], 
      [this.maskTop7, this.maskTop7Count], 
      [this.maskTop8, this.maskTop8Count], 
      [this.maskTop9, this.maskTop9Count], 
      [this.maskTop10, this.maskTop10Count]],
      columnStyles: {
        0: {cellWidth: 70},
        1: {cellWidth: 30},
      },
    });

    //Agregar pagina
    pdf.addPage();
    // Observaciones
    pdf.text('Observaciones', 15, 10);
    pdf.setFontSize(9);
    // Agregar las observaciones, por cada vez que se este por salir del margen de la hoja se hara un espacio
    const observaciones = pdf.splitTextToSize(this.observation, 180);
    pdf.text(observaciones, 15, 15);

    // Guardar el PDF
    pdf.save('documento.pdf');

  }

}
