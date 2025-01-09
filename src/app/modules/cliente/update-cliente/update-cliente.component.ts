import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ChangeDetectorRef } from '@angular/core';
import { ClientesService } from '../service/clientes.service';

@Component({
  selector: 'app-update-cliente',
  templateUrl: './update-cliente.component.html',
  styleUrls: ['./update-cliente.component.scss'],
})
export class UpdateClienteComponent {
  @Output() ClienteE: EventEmitter<any> = new EventEmitter();
  @Input() CLIENTE_SELECTED: any;

  nombre: string = '';
  cedula: string = '';
  direccion: string = '';
  telefono: string = '';
  correo: string = '';
  state: string = '1'; // Predeterminado: Activo

  isLoading: any;

  // Patrón para validar correos electrónicos
  emailPattern: RegExp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  constructor(
    public modal: NgbActiveModal,
    public clienteService: ClientesService,
    public toast: ToastrService,
    private cdr: ChangeDetectorRef // Agregar ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.nombre = this.CLIENTE_SELECTED.nombre;
    this.cedula = this.CLIENTE_SELECTED.cedula;
    this.direccion = this.CLIENTE_SELECTED.direccion;
    this.telefono = this.CLIENTE_SELECTED.telefono;
    this.correo = this.CLIENTE_SELECTED.correo;
    this.state = this.CLIENTE_SELECTED.state;
  }

  store() {
    // Validaciones básicas
    if (!this.nombre) {
      this.toast.error('Validación', 'Los nombres del cliente son requerido');
      return;
    }
    if (!this.cedula) {
      this.toast.error('Validación', 'La cédula es requerido');
      return;
    }
    if (!this.telefono) {
      this.toast.error('Validación', 'El teléfono es requerido');
      return;
    }
    if (!this.correo) {
      this.toast.error('Validación', 'El correo es requerido');
      return;
    }

    let data = {
      cli_nombres: this.nombre, // Nombre de la empresa
      cli_direccion: this.direccion, // Dirección
      cli_telefono: this.telefono, // Teléfono
      cli_cedula: this.cedula, // RUC
      cli_correo: this.correo, // Correo
      status: this.state, // Estado (Activo/Inactivo)
    };

    //console.log('Datos a enviar desde  Angular:', data);

    this.clienteService
      .updateCliente(this.CLIENTE_SELECTED.id, data)
      .subscribe((resp: any) => {
        console.log(resp);
        if (resp.message == 403) {
          this.toast.error('Validación', resp.message_text);
        } else {
          this.toast.success('Éxito', 'La empresa se editó correctamente');
          this.ClienteE.emit(resp.cliente);
          this.modal.close();
        }
      });
  }
}
