import { AuthService } from './../../auth/services/auth.service';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ContratosService } from '../service/contratos.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-create-contrato',
  templateUrl: './create-contrato.component.html',
  styleUrls: ['./create-contrato.component.scss'],
})
export class CreateContratoComponent {
  @Output() ContratoC: EventEmitter<any> = new EventEmitter();

  @Input() clientes: any = []; // Asegúrate de que esta propiedad esté definida correctamente
  @Input() servicios: any = [];

  clienteSeleccionado: number; // Almacena el cli_id del cliente seleccionado
  servicioSeleccionado: { [key: string]: boolean } = {}; // Usamos un objeto para controlar los checkboxes seleccionados

  totalPrecio: number = 0;

  sucursale_id: string = '';
  cliente_id: string = '';
  usuario_id: string = '';
  tipo_contrato: string = '';
  numero_contrato: string = '';
  fecha_inicio: string = '';
  fecha_fin: string = '';
  telefono: string = '';
  imagen_product: any;
  direccion: any;
  ciudad: any;
  parroquia: any;
  state: string = '1'; // Predeterminado: Activo

  file_name: any;
  pdf_name: any;
  imagen_previzualiza: any;

  isLoading: any;

  user$: Observable<any>;

  constructor(
    private auth: AuthService,
    private cdr: ChangeDetectorRef,
    // public modal: NgbActiveModal,
    public contratoService: ContratosService,
    public toast: ToastrService
  ) {}

  ngOnInit(): void {
    // Obtenemos el usuario logeado y asignamos el ID a usuario_id
    this.user$ = this.auth.currentUserSubject.asObservable();

    this.user$.subscribe((user) => {
      if (user && user.id) {
        this.usuario_id = user.id; // Asignamos el ID del usuario logeado
        console.log('Usuario logeado: ', this.usuario_id); // Para confirmar
      }
    });

    this.contratoService.configAll().subscribe((resp: any) => {
      console.log('Datos de servicio:', resp); // Verifica lo que se recibe de la API
      this.servicios = resp.servicios; // Asegúrate de que los datos se asignen correctamente
      this.cdr.detectChanges(); // Forzar la actualización
    });
    /*this.contratoService.configAll().subscribe((resp: any) => {
      console.log('Datos de cliente:', resp); // Verifica lo que se recibe de la API
      this.clientes = resp.clientes; // Asegúrate de que los datos se asignen correctamente
      this.cdr.detectChanges(); // Forzar la actualización
    });*/
  }

  onServicioChange(servicio: any): void {
    if (this.servicioSeleccionado[servicio.ser_id]) {
      // Si el servicio es seleccionado, sumamos el precio
      this.totalPrecio += parseFloat(servicio.ser_precio);
    } else {
      // Si el servicio es deseleccionado, restamos el precio
      this.totalPrecio -= parseFloat(servicio.ser_precio);
    }

    // Imprimir el total en la consola
    console.log(`Total seleccionado: ${this.totalPrecio}`);
  }

  onClienteChange() {
    const selectElement = document.querySelector(
      'select[name="cliente_selected"]'
    ) as HTMLSelectElement;
    const selectedOption = selectElement.options[selectElement.selectedIndex]; // Obtener el option seleccionado

    // Obtener el texto visible (lo que aparece dentro del option)
    const optionText = selectedOption ? selectedOption.text : null;

    if (optionText) {
      // Dividir el texto en dos partes: el nombre y la cédula
      const partes = optionText.split(' - ');

      if (partes.length === 2) {
        const cedula = partes[0]; // La cédula está en la segunda parte
        console.log('Cédula extraída:', cedula);

        // Asignar el número de contrato como "CEL_" + cédula
        this.numero_contrato = 'CEL_' + cedula;
      } else {
        console.warn('El formato del texto no es el esperado.');
      }
    } else {
      console.warn('No se encontró ningún texto en el option.');
    }
  }

  isLoadingProcess() {
    this.contratoService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.contratoService.isLoadingSubject.next(false);
    }, 50);
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
    // Validaciones básicas
    if (!this.cliente_id) {
      this.toast.error('Validación', 'Debe Seleccionar un cliente');
      return;
    }

    if (!this.numero_contrato) {
      this.toast.error('Validación', 'Falta el numero de Contrato');
      return;
    }

    this.isLoading = true;

    // Transformar los servicios seleccionados en una cadena separada por comas
    const serviciosSeleccionados = Object.keys(this.servicioSeleccionado)
      .filter((key) => this.servicioSeleccionado[key])
      .join(',');

    // Crear un objeto FormData
    const formData = new FormData();

    // Agregar los campos de texto al FormData
    formData.append('con_id_cliente', this.cliente_id);
    formData.append('con_id_usuario', this.usuario_id);
    formData.append('con_tipo_contrato', serviciosSeleccionados);
    formData.append('con_numero_contrato', this.numero_contrato);
    formData.append('con_fecha_inicio_con', this.fecha_inicio);
    formData.append('con_fecha_fin_con', this.fecha_fin);
    formData.append('con_telefono', this.telefono);
    formData.append('con_direccion_instalacion', this.direccion);
    formData.append('con_ciudad', this.ciudad);
    formData.append('con_parroquia', this.parroquia);
    formData.append('status', this.state);
    // Convertir totalPrecio a string antes de agregarlo
    formData.append('con_total_precio', this.totalPrecio.toString());

    // Si hay un archivo PDF seleccionado, agregarlo a FormData
    if (this.file_name) {
      formData.append('con_pdf_contrato', this.file_name); // Aquí se agrega el archivo PDF
    }

    // Llamar al servicio para registrar el contrato
    this.contratoService.registerContrato(formData).subscribe((resp: any) => {
      console.log('Respuesta del backend:', resp);
      if (resp.message == 403) {
        this.toast.error('Validación', resp.message_text);
      } else {
        this.toast.success('Éxito', 'Se realizó con éxito el contrato');
        this.ContratoC.emit(resp.contrato);
        //this.modal.close();
      }
    });
  }
}
