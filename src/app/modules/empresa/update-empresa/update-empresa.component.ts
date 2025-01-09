import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { EmpresasService } from '../service/empresas.service';

@Component({
  selector: 'app-update-empresa',
  templateUrl: './update-empresa.component.html',
  styleUrls: ['./update-empresa.component.scss'],
})
export class UpdateEmpresaComponent {
  @Output() EmpresaE: EventEmitter<any> = new EventEmitter();
  @Input() EMPRESA_SELECTED: any;

  nombre: string = '';
  ruc: string = '';
  direccion: string = '';
  telefono: string = '';
  correo: string = '';
  imagen: File | null = null;
  state: string = '1'; // Predeterminado: Activo

  isLoading: any;

  file_name: any;
  imagen_previzualiza: any;

  // Patrón para validar correos electrónicos
  emailPattern: RegExp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  constructor(
    public modal: NgbActiveModal,
    public empresaService: EmpresasService,
    public toast: ToastrService
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.nombre = this.EMPRESA_SELECTED.nombre;
    this.ruc = this.EMPRESA_SELECTED.ruc;
    this.direccion = this.EMPRESA_SELECTED.direccion;
    this.telefono = this.EMPRESA_SELECTED.telefono;
    this.correo = this.EMPRESA_SELECTED.correo;
    this.imagen = this.EMPRESA_SELECTED.imagen;
    this.state = this.EMPRESA_SELECTED.state;
  }
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
    if (!this.nombre) {
      this.toast.error('Validación', 'El nombre de la empresa es requerido');
      return false;
    }

    let data = {
      emp_nombre: this.nombre, // Nombre de la empresa
      emp_ruc: this.ruc, // RUC
      emp_direccion: this.direccion, // Dirección
      emp_telefono: this.telefono, // Teléfono
      emp_correo: this.correo, // Correo
      status: this.state, // Estado (Activo/Inactivo)
    };

    //console.log('Datos a enviar desde  Angular:', data);

    this.empresaService
      .updateEmpresa(this.EMPRESA_SELECTED.id, data)
      .subscribe((resp: any) => {
        console.log('Respuesta del backend:', resp);
        if (resp.message == 403) {
          this.toast.error('Validación', resp.message_text);
        } else {
          this.toast.success('Exito', 'La empresa se edito correctamente');
          this.EmpresaE.emit(resp.empresa);
          this.modal.close();
        }
      });
  }
}
