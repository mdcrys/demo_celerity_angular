import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { EmpresasService } from '../../empresa/service/empresas.service';
import { ClientesService } from '../service/clientes.service';

@Component({
  selector: 'app-delete-cliente',
  templateUrl: './delete-cliente.component.html',
  styleUrls: ['./delete-cliente.component.scss'],
})
export class DeleteClienteComponent {
  @Output() ClienteD: EventEmitter<any> = new EventEmitter();
  @Input() CLIENTE_SELECTED: any;

  isLoading: any;
  constructor(
    public modal: NgbActiveModal,
    public clienteService: ClientesService,
    public toast: ToastrService
  ) {}

  ngOnInit(): void {}

  delete() {
    this.clienteService
      .deleteCliente(this.CLIENTE_SELECTED.id)
      .subscribe((resp: any) => {
        console.log(resp);
        if (resp.message == 403) {
          this.toast.error('Validación', resp.message_text);
        } else {
          this.toast.success('Exito', 'El Cliente se eliminó correctamente');
          this.ClienteD.emit(resp.message);
          this.modal.close();
        }
      });
  }
}
