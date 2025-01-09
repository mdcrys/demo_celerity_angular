import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../auth';
import { ContratosService } from '../service/contratos.service';

@Component({
  selector: 'app-ver-contrato',
  templateUrl: './ver-contrato.component.html',
  styleUrls: ['./ver-contrato.component.scss'],
})
export class VerContratoComponent {
  @Output() ContratoV: EventEmitter<any> = new EventEmitter();
  @Input() usuarioDatos: any; // Recibir los datos del usuario
  @Input() clienteDatos: any; // Recibir los datos del usuario
  @Input() servicioDatos: any; // Recibir los datos del usuario
  @Input() pagosDatos: any; // Recibir los datos del usuario
  @Input() trasladosDatos: any; // Recibir los datos del usuario

  contratoId: number; // Recibir el ID del contrato
  @Input() CLIENTE_SELECTED: any;

  clienteSeleccionado: number; // Almacena el cli_id del cliente seleccionado
  servicioSeleccionado: { [key: string]: boolean } = {}; // Usamos un objeto para controlar los checkboxes seleccionados

  totalPrecio: number = 0;
  mensajeError: string = '';

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

  //Datos del Usuario desde el Servicio Usuario
  // Variables locales para mostrar los datos del usuario
  usuarioNombre: string = '';
  usuarioApellido: string = '';
  usuarioEmail: string = '';
  usuarioTelefono: string = '';

  //Datos del Cliente
  clienteNombre: string = '';
  clienteCedula: string = '';

  //Datos del Servicio
  ServicioNombre: string = '';

  constructor(
    private cdr: ChangeDetectorRef,
    public modal: NgbActiveModal,
    public contratoService: ContratosService,
    public toast: ToastrService
  ) {}

  ngOnInit(): void {
    console.log('ID recibido en el modal:', this.usuarioNombre); // Verifica si el ID está llegando aquí
    console.log('Datos del usuario recibido:', this.usuarioDatos);
    console.log('Pagos recibidos en el modal:', this.pagosDatos); // Debe mostrar el arreglo con los pagos
    //this.cdr.detectChanges(); // Asegúrate de que Angular detecte cambios

    console.log('Datos de pagos recibidos:', this.pagosDatos);

    // Verificar si pagosDatos tiene una propiedad 'pagos' que sea un array
    if (this.pagosDatos && Array.isArray(this.pagosDatos.pagos)) {
      this.pagosDatos = this.pagosDatos.pagos; // Reasignar a solo el array de pagos
      console.log('Pagos encontrados:', this.pagosDatos);
    } else {
      this.pagosDatos = []; // Si no es un array, inicializamos como vacío
      console.log('No se encontraron pagos.');
    }

    // Verificar si trasladosDatos tiene una propiedad 'traslados' que sea un array
    if (this.trasladosDatos && Array.isArray(this.trasladosDatos.traslados)) {
      this.trasladosDatos = this.trasladosDatos.traslados; // Reasignar a solo el array de traslados
      console.log('Traslados encontrados:', this.trasladosDatos);

      if (this.trasladosDatos.length === 0) {
        this.mensajeError = 'No hay traslados disponibles para este contrato.';
      }
    } else {
      this.trasladosDatos = []; // Si no es un array, inicializamos como vacío
      this.mensajeError = 'No hay traslados disponibles para este contrato.';
      console.log('No se encontraron traslados.');
    }

    this.cdr.detectChanges(); // Forzar la actualización del DOM

    this.numero_contrato = this.CLIENTE_SELECTED.numerocontrato;
    this.tipo_contrato = this.CLIENTE_SELECTED.tipocontrato;
    this.cliente_id = this.CLIENTE_SELECTED.cliente;
    this.usuario_id = this.CLIENTE_SELECTED.usurioreg;
    this.sucursale_id = this.CLIENTE_SELECTED.correo;
    this.direccion = this.CLIENTE_SELECTED.direccion_instalacion;
    this.ciudad = this.CLIENTE_SELECTED.ciudad;
    this.parroquia = this.CLIENTE_SELECTED.parroqui;
    this.fecha_inicio = this.CLIENTE_SELECTED.state;

    // Asignar datos del usuario a las variables locales
    if (this.usuarioDatos) {
      this.usuarioNombre = this.usuarioDatos.name || '';
      this.usuarioApellido = this.usuarioDatos.surname || '';
      this.usuarioEmail = this.usuarioDatos.email || '';
      this.usuarioTelefono = this.usuarioDatos.phone || '';
    }

    // Asignar datos para clientes
    if (this.clienteDatos) {
      this.clienteNombre = this.clienteDatos.cli_nombres || '';
      this.clienteCedula = this.clienteDatos.cli_cedula || '';
    }
  }
}
