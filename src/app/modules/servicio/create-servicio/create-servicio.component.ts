import { Component, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ServicioService } from '../service/servicio.service';

@Component({
  selector: 'app-create-servicio',
  templateUrl: './create-servicio.component.html',
  styleUrls: ['./create-servicio.component.scss'],
})
export class CreateServicioComponent {
  @Output() ServicioC: EventEmitter<any> = new EventEmitter();
  nombre: string = '';
  precio: string = '';
  state: string = '1'; // Predeterminado: Activo

  isLoading: any;

  constructor(
    public modal: NgbActiveModal,
    public servicioService: ServicioService,
    public toast: ToastrService
  ) {}

  store() {
    // Validaciones básicas
    if (!this.nombre) {
      this.toast.error('Validación', 'Los nombres del servicio son requerido');
      return;
    }
    if (!this.precio) {
      this.toast.error('Validación', 'El precio es requerido');
      return;
    }

    this.isLoading = true;

    // Crear objeto FormData para enviar datos
    let data = {
      ser_nombre: this.nombre, // Nombre de la empresa
      ser_precio: this.precio, // Dirección
      status: this.state, // Estado (Activo/Inactivo)
    };

    // Llamar al servicio para registrar la empresa
    this.servicioService.registerServicio(data).subscribe((resp: any) => {
      console.log('Respuesta del backend:', resp); // Verifica que la respuesta esté llegando
      if (resp.message == 403) {
        this.toast.error('Validación', resp.message_text);
      } else if (resp.message == 200) {
        console.log('Registro exitoso, mostrando toast...');
        this.toast.success('Exito', 'El Cliente se registró correctamente');
        this.ServicioC.emit(resp.servicios);
        this.modal.close(); // Solo cierra el modal si se registra con éxito
      }
    });
  }
}
