import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../auth';
import { ContratosService } from '../service/contratos.service';
import { CreatePagosContratoComponent } from '../create-pagos-contrato/create-pagos-contrato.component';

@Component({
  selector: 'app-pagos-contrato',
  templateUrl: './pagos-contrato.component.html',
  styleUrls: ['./pagos-contrato.component.scss'],
})
export class PagosContratoComponent {
  @Input() pagos: any = [];
  contratoId: number; // Recibir el ID del contrato
  PAGOS: any = [];

  pago: any = [];

  constructor(
    private auth: AuthService,
    private cdr: ChangeDetectorRef,
    public modalService: NgbModal,
    public modal: NgbActiveModal,
    public contratoService: ContratosService,
    public toast: ToastrService
  ) {}

  ngOnInit(): void {
    console.log('ID recibido en el modal2:', this.pago); // Verifica si el ID está llegando aquí
    console.log('ID recibido en el modal:', this.contratoId); // Verifica si el ID está llegando aquí

    if (this.contratoId) {
      this.contratoService.PagosAll(this.contratoId).subscribe((resp: any) => {
        console.log('Pagos recibidos:', resp);
        this.pagos = resp.pagos || []; // Manejar si no hay pagos
      });
    } else {
      console.error('No se recibió un ID de contrato válido.');
    }
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

  editPago(PAGO: any) {
    const modalRef = this.modalService.open(CreatePagosContratoComponent, {
      centered: true,
      size: 'md',
    });
    modalRef.componentInstance.PAGO_SELECTED = PAGO; // Pasar el pago seleccionado al modal

    modalRef.componentInstance.PagoE.subscribe((pago: any) => {
      let INDEX = this.PAGOS.findIndex((pag: any) => pag.id == pago.id);
      if (INDEX != -1) {
        this.PAGOS[INDEX] = pago;
      }
    });
  }
}
