import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth';
import { CancelacionService } from '../service/cancelacion.service';
import { PdfCancelacionComponent } from '../pdf-cancelacion/pdf-cancelacion.component';

@Component({
  selector: 'app-create-cancelacion',
  templateUrl: './create-cancelacion.component.html',
  styleUrls: ['./create-cancelacion.component.scss'],
})
export class CreateCancelacionComponent {
  @Output() DebitoC: EventEmitter<any> = new EventEmitter();
  @ViewChild(PdfCancelacionComponent)
  pdfCancaelacionComponent: PdfCancelacionComponent;
  cliente: any = {
    con_numero_contrato: '', // Número de contrato vacío
    cli_cedula: '', // Cédula vacía
    cli_nombres: '', // Nombre vacío,
    emp_ruc: '',
    emp_codigo_abonado: '',
    emp_nombre: '',
  };
  isLoading: any; // Propiedad existente
  selectedOption: string = ''; // Opción seleccionada
  currentDate: string = ''; // Fecha actual
  ejecutivo: string = ''; // Fecha actual
  cedula: string = '';
  contrato: string = '';
  usuario_id: string = '';
  descripcionEquipo: string = '';
  serieEquipo: string = '';
  estadoEquipo: string = '';
  entregaEquipos: string = '';
  entregaFuentes: string = '';
  entregaBase: string = '';
  incidenciaCancelacion: string = '';
  incidenciaRetiro: string = '';
  incidenciaMotivo: string = '';
  observaiones: string = '';
  //selectedOption: string = '';

  state: string = '1'; // Predeterminado: Activo

  //cliente: any = { cli_nombres: '', cli_cedula: '' }; // Datos simulados
  //currentDate: string = new Date().toLocaleDateString();

  // Variable para mostrar el componente PdfDebito
  showPdfComponent: boolean = false;

  file_name: any;

  user$: Observable<any>;

  constructor(
    private auth: AuthService,
    public cancelacionService: CancelacionService,
    public toast: ToastrService,
    private cdr: ChangeDetectorRef // Importar el servicio
  ) {
    this.isLoading = false; // Inicia como falso por defecto
    this.currentDate = this.getCurrentDate(); // Asignar fecha actual
  }
  ngOnInit(): void {
    // Obtenemos el usuario logeado y asignamos el ID a usuario_id
    this.user$ = this.auth.currentUserSubject.asObservable();

    this.user$.subscribe((user) => {
      if (user && user.id) {
        this.usuario_id = user.id; // Asignamos el ID del usuario logeado
        console.log('Usuario logeado: ', this.usuario_id); // Para confirmar
      }
    });
  }

  // Método para obtener la fecha actual en formato YYYY-MM-DD
  getCurrentDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Método para manejar el clic en el botón de Buscar
  serchClientes() {
    // Validar que al menos uno de los campos (cédula o contrato) esté lleno
    if (!this.cedula && !this.contrato) {
      this.toast.warning(
        'Debe llenar al menos el número de cédula o el número de contrato para buscar al cliente.',
        'Advertencia'
      );
      return; // Detenemos la ejecución de la función si no hay datos en ambos campos
    }
    console.log(
      'Buscando cliente con cédula:',
      this.cedula,
      'y contrato:',
      this.contrato
    );
    this.cancelacionService
      .searchClientes(this.cedula, this.contrato)
      .subscribe(
        (response) => {
          if (response.Contratos.length > 0) {
            this.cliente = response.Contratos[0]; // Actualizamos el cliente
            this.toast.success(
              `Cliente encontrado: ${this.cliente.cli_nombres}`,
              'Éxito'
            ); // Mostramos mensaje de éxito con el nombre del cliente
          } else {
            console.log('Cliente no encontrado');
            this.cliente = {}; // Reseteamos el cliente si no se encuentra
            this.toast.warning('Cliente no encontrado', 'Advertencia'); // Mensaje si no hay cliente
          }
          this.cdr.detectChanges(); // Forzamos la actualización de la vista
        },
        (error) => {
          console.error('Error al buscar cliente:', error);
          this.cliente = {};
          this.toast.error('Ocurrió un error al buscar el cliente', 'Error'); // Mensaje de error en caso de fallo
          this.cdr.detectChanges(); // Aseguramos que se reflejen los cambios
        }
      );
  }

  // Método para manejar el clic en el botón de Registrar
  registerData() {
    // Aquí iría la lógica de registro, como una llamada a la API
    console.log('Registrando datos...');
    this.cancelacionService.searchClientes(this.cedula, this.contrato);
  }

  // Método para mostrar el componente PdfDebito
  showPdf() {
    this.showPdfComponent = true; // Activar la visibilidad del componente PdfDebito
  }

  // Llama a exportToPDF del componente hijo
  /*exportPDF() {
    if (this.pdfCancaelacionComponent) {
      this.pdfCancaelacionComponent.exportToPDF();
    }
  }*/

  validateForm(): boolean {
    // Validación del Número de Cédula
    if (!this.cliente?.cli_cedula) {
      this.toast.warning(
        'Debe consultar primero el cliente, el número de cédula está vacío.',
        'Advertencia'
      );
      return false; // Detener la ejecución y retornar false si falla la validación
    }

    // Si pasa todas las validaciones, retornar true
    return true; // El formulario es válido si llega hasta aquí
  }

  // Esta es la función que se llama cuando se da clic en el botón "Exportar a PDF"
  exportPDF() {
    // Llamamos a la función de validación antes de proceder con la exportación
    const isFormValid = this.validateForm(); // Esto activa las validaciones y obtiene el resultado

    if (!isFormValid) {
      // Si la validación falla, no hacemos nada y terminamos la función
      return; // Detenemos el proceso de exportación
    }

    // Si la validación pasa, mostramos el mensaje de "Generando PDF..."
    this.toast.info('Generando PDF...', 'Por favor espera', {
      timeOut: 0, // Mantener el mensaje visible indefinidamente
      closeButton: true,
      progressBar: true,
    });

    // Llamar a la función para esperar 5 segundos y luego ejecutar el export
    this.delayExecution();
  }

  // Función para esperar 5 segundos antes de ejecutar la siguiente función
  delayExecution() {
    setTimeout(() => {
      // Llamar a la función que genera el PDF
      this.generatePDF();
    }, 1000); // 5000 ms = 5 segundos
  }

  // Función para generar el PDF
  generatePDF() {
    if (this.pdfCancaelacionComponent) {
      Promise.resolve(this.pdfCancaelacionComponent.exportToPDF())
        .then(() => {
          this.toast.clear(); // Limpiar el mensaje de "Generando PDF..."
          this.showPdfComponent = false; // Ocultar el componente PDF
          this.toast.success('PDF generado con éxito', 'Éxito'); // Mostrar mensaje de éxito
        })
        .catch((error: any) => {
          this.toast.clear();
          console.error('Error al generar el PDF:', error);
          this.toast.error('Error al generar el PDF', 'Error'); // Mostrar mensaje de error
        });
    }
  }

  // Método para procesar el archivo PDF
  processFile($event: any): void {
    const file = $event.target.files[0];

    // Verifica si el archivo es un PDF
    if (file && file.type === 'application/pdf') {
      this.file_name = file; // Asigna el archivo PDF seleccionado
      console.log('Archivo PDF seleccionado:', this.file_name);
    } else {
      this.toast.warning('WARN', 'El archivo no es un PDF');
    }
  }

  store() {
    this.isLoading = true;

    // Crear un objeto FormData
    const formData = new FormData();

    // Agregar los campos de texto al FormData
    /*  formData.append('aud_fecha_autorizacion', this.currentDate); // Fecha actual
    formData.append('aud_codigo_contrato', this.cliente?.con_numero_contrato); // Código de contrato
   // formData.append('aud_entidad_financiera', this.financialEntity); // Entidad financiera
    formData.append('aud_nombre_cliente', this.cliente?.cli_nombres); // Nombre del cliente
    formData.append('aud_cedula_cliente', this.cliente?.cli_cedula); // Cédula del cliente
    formData.append('aud_tarejeta_cedito', this.creditCardNumber || ''); // Número de tarjeta de crédito
    formData.append('aud_mes_exp', this.creditCardExpiryMonth || ''); // Mes de expiración
    formData.append('aud_anio_exp', this.creditCardExpiryYear || ''); // Año de expiración
    formData.append('aud_cuenta_ahorrros', this.savingsAccountNumber || ''); // Cuenta de ahorros
    formData.append('aud_cuenta_credito', this.creditAccountNumber || ''); // Cuenta de crédito
    formData.append('aud_id_usuario', this.usuario_id); // ID de usuario
    formData.append('status', this.state); // Estado del registro*/

    // Si hay un archivo PDF seleccionado, agregarlo a FormData
    if (this.file_name) {
      formData.append('aud_pdf', this.file_name); // Aquí se agrega el archivo PDF
    }

    // Llamar al servicio para registrar el contrato
    this.cancelacionService.registerDebio(formData).subscribe((resp: any) => {
      console.log('Respuesta del backend:', resp);
      if (resp.message == 403) {
        this.toast.error('Validación', resp.message_text);
      } else {
        this.toast.success('Éxito', 'Se registró correctamente');
        this.DebitoC.emit(resp.contrato);
        //this.modal.close();
      }
    });
  }
}
