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
  selector: 'app-create-pagos-contrato',
  templateUrl: './create-pagos-contrato.component.html',
  styleUrls: ['./create-pagos-contrato.component.scss'],
})
export class CreatePagosContratoComponent {
  @Output() PagoE: EventEmitter<any> = new EventEmitter();
  @Input() PAGO_SELECTED: any;

  contrato: string = '';
  monto: string = '';
  tipoPago: string = '';
  fecha_pago: string = '';
  state: string = '1'; // Predeterminado: Activo

  @Input() pagos: any = [];
  contratoId: number; // Recibir el ID del contrato

  file: File | null = null; // Aquí almacenaremos el archivo PDF seleccionado

  isLoading: any;

  constructor(
    private auth: AuthService,
    private cdr: ChangeDetectorRef,
    public modal: NgbActiveModal,
    public contratoService: ContratosService,
    public toast: ToastrService
  ) {}

  ngOnInit(): void {
    console.log('Pago seleccionado:', this.PAGO_SELECTED);
    console.log('ID recibido en el modal:', this.contratoId); // Verifica si el ID está llegando aquí

    if (this.contratoId) {
      this.contratoService.PagosAll(this.contratoId).subscribe((resp: any) => {
        console.log('Pagos recibidos:', resp);
        this.pagos = resp.pagos || []; // Manejar si no hay pagos
      });
    } else {
      console.error('No se recibió un ID de contrato válido.');
    }

    this.contrato = this.PAGO_SELECTED.nombre;
    this.monto = this.PAGO_SELECTED.cedula;
    this.tipoPago = this.PAGO_SELECTED.direccion;
    this.fecha_pago = this.PAGO_SELECTED.telefono;
    this.state = this.PAGO_SELECTED.state || 2;
  }

  pagarPago(pago: any): void {
    console.log('Procesando pago para:', pago);
    // Lógica para pagar el contrato, por ejemplo, actualizar el estado de los pagos
    /*this.contratoService.marcarPagosComoRealizados(this.contratoId).subscribe(
        (response: any) => {
          this.toast.success('Pago realizado con éxito.');
          this.modal.close(); // Cierra el modal después de realizar el pago
        },
        (error: any) => {
          this.toast.error('Error al realizar el pago.');
          console.error(error);
        }
      );*/
  }

  // Método para procesar el archivo PDF
  processFile($event: any): void {
    const file = $event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.file = file;
      console.log('Archivo PDF seleccionado:', this.file);
    } else {
      this.toast.warning('WARN', 'El archivo no es un PDF');
    }
  }

  store() {
    let data = {
      pag_id_contrato: this.PAGO_SELECTED.pag_id_contrato, // Nombre de la empresa (o ID del contrato)
      pag_monto: this.PAGO_SELECTED.pag_monto, // Dirección
      pag_tipo_pago: this.tipoPago, // Tipo de pago
      pag_fecha_pago: this.fecha_pago, // Fecha de pago
      status: this.state,
    };

    console.log('Datos a enviar:', data); // Asegúrate de que 'status' esté presente

    console.log(
      'Enviando solicitud PUT para el pago con ID:',
      this.PAGO_SELECTED.pag_id
    ); // Verifica que el ID es correcto

    this.contratoService
      .updatePago(this.PAGO_SELECTED.pag_id, data) // Usa 'pag_id' en lugar de 'id'
      .subscribe((resp: any) => {
        console.log(resp);
        if (resp.message == 403) {
          this.toast.error('Validación', resp.message_text);
        } else {
          this.toast.success('Éxito', 'Se Realizó completamente el pago');
          this.PagoE.emit(resp.pagos);
          this.modal.close();
        }
      });
  }
}
