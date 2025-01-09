import { Component, Input } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-pdf-debito',
  templateUrl: './pdf-debito.component.html',
  styleUrls: ['./pdf-debito.component.scss'],
})
export class PdfDebitoComponent {
  @Input() cliente: any = {};
  @Input() selectedOption: string = '';
  @Input() creditCardNumber: string = '';
  @Input() creditCardExpiryMonth: string = '';
  @Input() creditCardExpiryYear: string = '';
  @Input() savingsAccountNumber: string = '';
  @Input() creditAccountNumber: string = '';
  @Input() currentDate: string = new Date().toLocaleDateString();
  @Input() financialEntity: string;

  exportToPDF(): Promise<void> {
    return new Promise((resolve, reject) => {
      const element = document.getElementById('pdf-content');

      if (element) {
        html2canvas(element, { backgroundColor: '#ffffff' })
          .then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const doc = new jsPDF();
            const pdfWidth = 190;
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            const marginTop = 20;
            const marginLeft = 15;

            doc.addImage(
              imgData,
              'PNG',
              marginLeft,
              marginTop,
              pdfWidth,
              pdfHeight
            );

            // Usar nombre y cédula del cliente para el nombre del archivo PDF
            const clientName = this.cliente?.cli_nombres || 'Cliente';
            const clientId = this.cliente?.cli_cedula || 'Cedula';
            const fileName = `${clientName}_${clientId}_autorizacion_debito.pdf`;

            // Guardar el PDF con el nombre dinámico
            doc.save(fileName);

            resolve(); // Resolver la promesa cuando el PDF esté listo
          })
          .catch((error) => {
            console.error('Error al generar el PDF:', error);
            reject(error); // Rechazar la promesa si hay un error
          });
      } else {
        console.error(
          'No se encontró el elemento HTML con el ID especificado.'
        );
        reject('Elemento no encontrado');
      }
    });
  }
}
