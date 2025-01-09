import { Component, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ClientesService } from '../service/clientes.service';

@Component({
  selector: 'app-create-cliente',
  templateUrl: './create-cliente.component.html',
  styleUrls: ['./create-cliente.component.scss'],
})
export class CreateClienteComponent {
  @Output() ClienteC: EventEmitter<any> = new EventEmitter();
  nombre: string = '';
  cedula: string = '';
  direccion: string = '';
  telefono: string = '';
  correo: string = '';
  state: string = '1'; // Predeterminado: Activo

  isLoading: any;

  constructor(
    public modal: NgbActiveModal,
    public clienteService: ClientesService,
    public toast: ToastrService
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
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

    // Crear objeto FormData para enviar datos
    let data = {
      cli_nombres: this.nombre, // Nombre de la empresa
      cli_direccion: this.direccion, // Dirección
      cli_telefono: this.telefono, // Teléfono
      cli_cedula: this.cedula, // RUC
      cli_correo: this.correo, // Correo
      status: this.state,
    };

    // Llamar al servicio para registrar la empresa
    this.clienteService.registerCliente(data).subscribe((resp: any) => {
      console.log('Respuesta del backend:', resp); // Verifica que la respuesta esté llegando
      if (resp.message == 403) {
        this.toast.error('Validación', resp.message_text);
      } else if (resp.message == 200) {
        console.log('Registro exitoso, mostrando toast...');
        this.toast.success('Exito', 'El Cliente se registró correctamente');
        this.ClienteC.emit(resp.cliente_person);
        this.modal.close(); // Solo cierra el modal si se registra con éxito
      }
    });
  }
}
