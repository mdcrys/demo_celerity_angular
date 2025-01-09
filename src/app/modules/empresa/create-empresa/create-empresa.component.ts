import { Component, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { EmpresasService } from '../service/empresas.service';

@Component({
  selector: 'app-create-empresa',
  templateUrl: './create-empresa.component.html',
  styleUrls: ['./create-empresa.component.scss'],
})
export class CreateEmpresaComponent {
  @Output() EmpresaC: EventEmitter<any> = new EventEmitter();
  name: string = '';
  ruc: string = '';
  direccion: string = '';
  telefono: string = '';
  correo: string = '';
  imagen: File | null = null;
  state: string = '1'; // Predeterminado: Activo

  file_name: any;
  imagen_previzualiza: any;

  isLoading: any;

  constructor(
    public modal: NgbActiveModal,
    public empresasService: EmpresasService,
    public toast: ToastrService
  ) {}

  // Método para manejar la selección de archivos
  processFile($event: any) {
    if ($event.target.files[0].type.indexOf('image') < 0) {
      this.toast.warning('WARN', 'El archivo no es una imagen');
      return;
    }
    this.file_name = $event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.file_name);
    reader.onloadend = () => (this.imagen_previzualiza = reader.result);
  }

  store() {
    // Validaciones básicas
    if (!this.name) {
      this.toast.error('Validación', 'El nombre de la Empresa es requerido');
      return;
    }
    if (!this.ruc) {
      this.toast.error('Validación', 'El RUC es requerido');
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

    this.isLoading = true;

    // Crear objeto FormData para enviar datos
    const formData = new FormData();
    formData.append('emp_nombre', this.name); // 'name' en Angular se convierte a 'emp_nombre' en Laravel
    formData.append('emp_ruc', this.ruc); // 'ruc' en Angular se convierte a 'emp_ruc' en Laravel
    formData.append('emp_direccion', this.direccion); // 'direccion' en Angular se convierte a 'emp_direccion' en Laravel
    formData.append('emp_telefono', this.telefono); // 'telefono' en Angular se convierte a 'emp_telefono' en Laravel
    formData.append('emp_correo', this.correo); // 'correo' en Angular se convierte a 'emp_correo' en Laravel
    formData.append('status', this.state); // 'state' en Angular se convierte a 'status' en Laravel

    // Verificar si la imagen es válida antes de agregarla al FormData
    if (this.file_name) {
      // En Angular
      formData.append('imagen_empresa', this.file_name);
    } else {
      console.warn('No se ha seleccionado una imagen.');
    }

    // Llamar al servicio para registrar la empresa
    this.empresasService.registerEmpresa(formData).subscribe(
      (resp: any) => {
        this.isLoading = false;
        if (resp.message == 403) {
          this.toast.error('Validación', resp.message_text);
        } else {
          this.toast.success('Éxito', 'La Empresa se registró correctamente');
          this.EmpresaC.emit(resp.empresa);
          this.modal.close();
        }
      },
      (error) => {
        this.isLoading = false;
        this.toast.error(
          'Error',
          'Ocurrió un problema al registrar la Empresa'
        );
        console.error(error);
      }
    );
  }
}
