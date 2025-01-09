import { Component, Input } from '@angular/core';
import html2pdf from 'html2pdf.js'; // Usamos html2pdf.js directamente

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
      // Ajustes para evitar desbordamientos
      element.style.overflow = 'hidden'; // Evita que el contenido se desborde
      element.style.maxWidth = '100%'; // Asegura que el contenido no se expanda más allá de su contenedor
      element.style.wordWrap = 'break-word'; // Para romper palabras largas

      // Ajustar las celdas de la tabla
      const cells = Array.from(
        element.getElementsByTagName('th')
      ) as HTMLTableCellElement[];
      cells.forEach((cell) => {
        cell.style.whiteSpace = 'normal';
        cell.style.wordWrap = 'break-word';
        cell.style.overflowWrap = 'break-word';
        cell.style.maxWidth = '50px';
      });

      // Configuración de html2pdf
      const opt = {
        margin: 1,
        filename: '_autorizacion_debito.pdf', // Nombre del archivo PDF
        image: { type: 'png', quality: 0.98 },
        html2canvas: { scale: 2, logging: true, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      };

      // Generar el PDF directamente desde el contenido HTML
      html2pdf().from(element).set(opt).save();
    } else {
      console.error('No se encontró el elemento HTML con el ID especificado.');
    }
  }
}
