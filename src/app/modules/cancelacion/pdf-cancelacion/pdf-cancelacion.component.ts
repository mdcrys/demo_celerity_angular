import { Component, Input } from '@angular/core';
import html2pdf from 'html2pdf.js'; // Usamos html2pdf.js directamente
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-pdf-cancelacion',
  templateUrl: './pdf-cancelacion.component.html',
  styleUrls: ['./pdf-cancelacion.component.scss'],
})
export class PdfCancelacionComponent {
  @Input() cliente: any = {};
  @Input() clientName: string;
  @Input() clientId: string;
  @Input() clientRuc: string;
  @Input() contractNumber: string;
  @Input() companyName: string;
  @Input() currentDate: string;
  @Input() contractEndDate: string;
  @Input() pendingValues: string;
  @Input() executive: string;
  @Input() code: string;
  @Input() subscriberCode: string;
  @Input() descripcionEquipo: string;
  @Input() serieEquipo: string;
  @Input() estadoEquipo: string;
  @Input() entregaEquipos: string;
  @Input() entregaFuentes: string;
  @Input() entregaBase: string;
  @Input() incidenciaCancelacion: string;
  @Input() incidenciaRetiro: string;
  @Input() incidenciaMotivo: string;
  @Input() observaiones: string;

  exportToPDF(): void {
    const element = document.getElementById('pdf-content');

    if (element) {
      // Inicializar jsPDF
      const doc = new jsPDF({
        unit: 'mm',
        format: 'a4', // Formato de página A4
        orientation: 'portrait', // Orientación de la página
      });

      // Establecer márgenes para el PDF
      const margin = 10;

      // Generar el PDF desde el contenido HTML
      doc.html(element, {
        margin: margin,
        callback: function (doc) {
          // Guardar el PDF con el nombre que elijas
          doc.save('_autorizacion_debito.pdf');
        },
        x: margin,
        y: margin,
        width: 170, // Ancho del contenido
        windowWidth: 800, // Establecer el ancho de la ventana de visualización
      });
    } else {
      console.error('No se encontró el elemento HTML con el ID especificado.');
    }
  }
}
