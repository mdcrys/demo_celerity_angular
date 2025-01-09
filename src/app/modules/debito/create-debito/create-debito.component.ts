import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DebitoService } from '../service/debito.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { PdfDebitoComponent } from '../pdf-debito/pdf-debito.component';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth';

@Component({
  selector: 'app-create-debito',
  templateUrl: './create-debito.component.html',
  styleUrls: ['./create-debito.component.scss'],
})
export class CreateDebitoComponent {
  @Output() DebitoC: EventEmitter<any> = new EventEmitter();
  @ViewChild(PdfDebitoComponent) pdfDebitoComponent: PdfDebitoComponent;
  cliente: any = {
    con_numero_contrato: '', // Número de contrato vacío
    cli_cedula: '', // Cédula vacía
    cli_nombres: '', // Nombre vacío
  };
  isLoading: any; // Propiedad existente
  selectedOption: string = ''; // Opción seleccionada
  currentDate: string = ''; // Fecha actual
  cedula: string = '';
  contrato: string = '';
  usuario_id: string = '';
  //selectedOption: string = '';
  creditCardNumber: string = '';
  creditCardExpiryMonth: string = '';
  creditCardExpiryYear: string = '';
  savingsAccountNumber: string = '';
  creditAccountNumber: string = '';
  financialEntity: string = '';
  state: string = '1'; // Predeterminado: Activo

  //cliente: any = { cli_nombres: '', cli_cedula: '' }; // Datos simulados
  //currentDate: string = new Date().toLocaleDateString();

  // Variable para mostrar el componente PdfDebito
  showPdfComponent: boolean = false;

  file_name: any;

  user$: Observable<any>;

  constructor(
    private auth: AuthService,
    public debitoService: DebitoService,
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
    this.debitoService.serchClientes(this.cedula, this.contrato).subscribe(
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
  // Método para bloquear solo números
  onlyNumbers(event: KeyboardEvent) {
    // Permitir solo teclas de números (0-9), el retroceso (backspace) y el tabulador
    const regex = /^[0-9]$/;
    if (
      !regex.test(event.key) &&
      event.key !== 'Backspace' &&
      event.key !== 'Tab'
    ) {
      event.preventDefault(); // Bloquea la tecla si no es un número
    }
  }

  // Método para validar el número de tarjeta
  validateCreditCardNumber() {
    // Eliminar cualquier cosa que no sea un número
    this.creditCardNumber = this.creditCardNumber.replace(/[^0-9]/g, '');
  }

  // Validar que el mes de expiración sea solo números y tenga 2 dígitos entre 01 y 12
  validateExpiryMonth() {
    // Limpiar el campo para eliminar cualquier carácter no numérico
    this.creditCardExpiryMonth = this.creditCardExpiryMonth.replace(
      /[^0-9]/g,
      ''
    );
  }

  // Validar que el mes de expiración tenga solo 2 números entre 01 y 12
  validExpiryMonth() {
    return /^(0[1-9]|1[0-2])$/.test(this.creditCardExpiryMonth); // Acepta de 01 a 12
  }

  // Validar que el año de expiración sea solo números y tenga 4 dígitos
  validateExpiryYear() {
    // Limpiar el campo para eliminar cualquier carácter no numérico
    this.creditCardExpiryYear = this.creditCardExpiryYear.replace(
      /[^0-9]/g,
      ''
    );
  }

  // Validar que el año de expiración tenga solo 4 números
  validExpiryYear() {
    return /^[0-9]{4}$/.test(this.creditCardExpiryYear); // Acepta exactamente 4 números
  }

  // Validaciones individuales para cada campo
  validFinancialEntity() {
    return this.financialEntity && this.financialEntity.trim().length > 0;
  }

  validCreditCard() {
    return /^[0-9]{19}$/.test(this.creditCardNumber); // Solo números y máximo 19 caracteres
  }

  validSavingsAccount() {
    return (
      this.savingsAccountNumber && this.savingsAccountNumber.trim().length > 0
    );
  }

  validateForm(): boolean {
    // Validación del Número de Cédula
    if (!this.cliente?.cli_cedula) {
      this.toast.warning(
        'Debe consultar primero el cliente, el número de cédula está vacío.',
        'Advertencia'
      );
      return false; // Detener la ejecución y retornar false si falla la validación
    }
    // Validar que la entidad financiera esté llena
    if (!this.validFinancialEntity()) {
      this.toast.warning(
        'La entidad financiera es obligatoria.',
        'Advertencia'
      );
      return false; // Detener la ejecución y retornar false si falla la validación
    }

    // Validar que se haya seleccionado un método de pago
    if (!this.selectedOption) {
      this.toast.warning('Debe seleccionar un método de pago.', 'Advertencia');
      return false; // Detener la ejecución y retornar false si falla la validación
    }

    // Validación basada en el método de pago seleccionado
    if (this.selectedOption === 'credit_card') {
      // Validar que el número de tarjeta sea válido
      if (!this.validCreditCard()) {
        this.toast.warning(
          'Debe ingresar un número de tarjeta válido.',
          'Advertencia'
        );
        return false; // Detener la ejecución y retornar false si falla la validación
      }

      // Validar el mes de expiración
      if (!this.validExpiryMonth()) {
        this.toast.warning(
          'Debe ingresar un mes de expiración válido.',
          'Advertencia'
        );
        return false; // Detener la ejecución y retornar false si falla la validación
      }
    } else if (this.selectedOption === 'savings_account') {
      // Validar que el número de cuenta de ahorros esté lleno
      if (!this.validSavingsAccount()) {
        this.toast.warning(
          'Debe ingresar el número de cuenta de ahorros.',
          'Advertencia'
        );
        return false; // Detener la ejecución y retornar false si falla la validación
      }
    } else if (this.selectedOption === 'credit_account') {
      // Aquí puedes agregar validaciones para "Cuenta de Crédito Número" si es necesario
    }

    // Si pasa todas las validaciones, retornar true
    return true; // El formulario es válido si llega hasta aquí
  }

  // Método para manejar el clic en el botón de Registrar
  registerData() {
    // Aquí iría la lógica de registro, como una llamada a la API
    console.log('Registrando datos...');
    this.debitoService.serchClientes(this.cedula, this.contrato);
  }

  // Método para mostrar el componente PdfDebito
  showPdf() {
    this.showPdfComponent = true; // Activar la visibilidad del componente PdfDebito
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
    if (this.pdfDebitoComponent) {
      this.pdfDebitoComponent
        .exportToPDF()
        .then(() => {
          this.toast.clear(); // Limpiar el mensaje de "Generando PDF..."
          this.showPdfComponent = false; // Ocultar el componente PDF
          this.toast.success('PDF generado con éxito', 'Éxito'); // Mostrar mensaje de éxito
        })
        .catch((error) => {
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
    formData.append('aud_fecha_autorizacion', this.currentDate); // Fecha actual
    formData.append('aud_codigo_contrato', this.cliente?.con_numero_contrato); // Código de contrato
    formData.append('aud_entidad_financiera', this.financialEntity); // Entidad financiera
    formData.append('aud_nombre_cliente', this.cliente?.cli_nombres); // Nombre del cliente
    formData.append('aud_cedula_cliente', this.cliente?.cli_cedula); // Cédula del cliente
    formData.append('aud_tarejeta_cedito', this.creditCardNumber || ''); // Número de tarjeta de crédito
    formData.append('aud_mes_exp', this.creditCardExpiryMonth || ''); // Mes de expiración
    formData.append('aud_anio_exp', this.creditCardExpiryYear || ''); // Año de expiración
    formData.append('aud_cuenta_ahorrros', this.savingsAccountNumber || ''); // Cuenta de ahorros
    formData.append('aud_cuenta_credito', this.creditAccountNumber || ''); // Cuenta de crédito
    formData.append('aud_id_usuario', this.usuario_id); // ID de usuario
    formData.append('status', this.state); // Estado del registro

    // Si hay un archivo PDF seleccionado, agregarlo a FormData
    if (this.file_name) {
      formData.append('aud_pdf', this.file_name); // Aquí se agrega el archivo PDF
    }

    // Llamar al servicio para registrar el contrato
    this.debitoService.registerDebio(formData).subscribe((resp: any) => {
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
