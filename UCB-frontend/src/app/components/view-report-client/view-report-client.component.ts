import { Component } from '@angular/core';
import { Chart, ChartType } from 'chart.js/auto';
import { ReportService } from '../../service/report.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from '../../service/client.service';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'
import * as CryptoJS from 'crypto-js';
import { CompanyService } from '../../service/company.service';


import * as fileSaver from 'file-saver';
import * as pdfLib from 'pdf-lib';
import * as docxtemplater from 'docxtemplater';


import * as htmlDocx from 'html-docx-js';
import { saveAs } from 'file-saver';



import * as utf8 from 'text-encoding-utf-8';

import { Document, Packer, Paragraph, ImageRun } from "docx";



import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as FileSaver from 'file-saver';


@Component({
  selector: 'app-view-report-client',
  templateUrl: './view-report-client.component.html',
  styleUrl: './view-report-client.component.css'
})
export class ViewReportClientComponent {

  admin: boolean = false;
  client: boolean = false;
  //consultor: boolean = false;  
  reportId: number = 0;
  rol: string = '';
  customerId: number = 0;


  
  constructor(private reportService:ReportService, private router:Router, private route: ActivatedRoute, private clientService:ClientService, private http: HttpClient, private companyService: CompanyService){

    const rol = localStorage.getItem('rol');
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');
    const reportId = localStorage.getItem('reportId');

    if(rol){
      const secretKey = 'Dr34ml4b';
      // Descifrar el valor cifrado utilizando AES
      const bytes = CryptoJS.AES.decrypt(rol, secretKey);
      const decryptedAuditIdString = bytes.toString(CryptoJS.enc.Utf8);
  
      // Convertir la cadena de texto descifrada de vuelta a número
      this.rol  = decryptedAuditIdString, 10;
    }
    //Asignar el valor del id del cliente del toke
    if (id) {
      const secretKey = 'Dr34ml4b';
      // Descifrar el valor cifrado utilizando AES
      const bytes = CryptoJS.AES.decrypt(id, secretKey);
      const decryptedAuditIdString = bytes.toString(CryptoJS.enc.Utf8);
  
      // Convertir la cadena de texto descifrada de vuelta a número
      this.customerId  = parseInt(decryptedAuditIdString, 10);
    }    


    if(this.rol == 'ADMINISTRADOR' || this.rol == 'CONSULTOR') {
      
      this.admin = true;
    } else if (this.rol == 'CLIENTE') {
      this.client = true;
    } else {
      window.alert('No has iniciado sesión');
      this.router.navigate(['/login']);
    }
    //Asignar el valor de audit
    if (reportId) {
      const secretKey = 'Dr34ml4b';
      // Descifrar el valor cifrado utilizando AES
      const bytes = CryptoJS.AES.decrypt(reportId, secretKey);
      const decryptedAuditIdString = bytes.toString(CryptoJS.enc.Utf8);
  
      // Convertir la cadena de texto descifrada de vuelta a número
      this.reportId  = parseInt(decryptedAuditIdString, 10);
    }


  }

  chart: any;
  barra: any;
  //Variables para el reporte
  hashes:number = 0;
  hashesCracked:number = 0;
  proportionHash:number = 0;
  hashesNoCracked:number = 0;
  //Variable para grafico de barras
  lengthOne: number = 0;
  lengthTwo: number = 0;
  lengthThree: number = 0;
  lengthFour: number = 0;
  //Variable archivo
  fileCracked: string = "";
  id: number = 0;
  cliente: any = [];

  ngOnInit() {

    this.reportService.getReport(this.reportId).subscribe((dataApi: any) => {
      
      this.hashes = dataApi.data.countHashes
      this.hashesCracked = dataApi.data.countCracked

      this.hashesNoCracked = this.hashes - this.hashesCracked
      //Variblaes para el grafico de barras
      this.lengthOne = dataApi.data.lengthOne
      this.lengthTwo = dataApi.data.lengthTwo
      this.lengthThree = dataApi.data.lengthThree
      this.lengthFour = dataApi.data.lengthFour

      //Sacar el porcentaje de hashes crackeados
      this.proportionHash = Math.round((this.hashesCracked / this.hashes) * 10000) / 100;
      this.initializeCharts(this.hashesNoCracked, this.hashesCracked, this.lengthOne, this.lengthTwo, this.lengthThree, this.lengthFour);
      //Valor del archivo
      this.fileCracked = dataApi.data.fileCracked;
    });

    //Obtener informacion del cliente 
    this.clientService.getCustomerById(this.customerId).subscribe((data: any) => {
      
      this.cliente = data.data;
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
  //Descargar archivo
  Download() {
    
    // Decodificar el contenido del archivo
    const contenidoDecodificado = atob(this.fileCracked);

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
  
  // Función para decodificar una cadena UTF-8
  utf8Decode(encodedString: string): string {
    const decodedString = decodeURIComponent(escape(encodedString));
    return decodedString;
  }

  
  //===========================================================================================================================
  //Logica para cargado de archivo .txt
  importFile: File = new File([""], "archivo");
  file:string = '';
  importFile2: File = new File([""], "archivo");
  file2:string = '';
  onFileChange(event: any) {
    const file: File = event.target.files[0];
    this.importFile = file;
    
    this.file = file.name;
  }
  onFileChange2(event: any) {
    const file2: File = event.target.files[0];
    this.importFile2 = file2;
    
    this.file2 = file2.name;
  }
  //===========================================================================================================================
  //Exportar PDF


  exportPDF(){

    
    const pdf = new jsPDF();
    // Agregar contenido al PDF
    pdf.addImage('assets/icons/Logo-PwnCrack.jpg', 'PNG', 10, 10, 50, 20);

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(30);
    pdf.setTextColor('#000000');
    pdf.text('Reporte', 80, 25);

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
      body: [[this.hashes, this.proportionHash +' %']],
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
    pdf.text('Grafico estadistico', 15, 85);
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

    // Guardar el PDF
    pdf.save('documento.pdf');


  }

    //Función para backup
    downloadBackup() {
      
      this.http.get('http://localhost:8080/api/backup', { responseType: 'text' }).subscribe(response => {
        FileSaver.saveAs(new Blob([response], { type: 'application/octet-stream' }), 'backup.sql');
      });
    }


}
