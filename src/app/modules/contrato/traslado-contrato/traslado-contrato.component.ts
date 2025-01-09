import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../auth';
import { ContratosService } from '../service/contratos.service';

@Component({
  selector: 'app-traslado-contrato',
  templateUrl: './traslado-contrato.component.html',
  styleUrls: ['./traslado-contrato.component.scss'],
})
export class TrasladoContratoComponent {
  @Output() TrasladoC: EventEmitter<any> = new EventEmitter();
  contratoId: number; // Recibir el ID del contrato

  costoTraslado: number = 40;

  contrato_id: string = '';
  fecha_traslado: string = '';
  direccion_traslado: string = '';
  file_name: any;

  isLoading: any;

  constructor(
    private auth: AuthService,
    private cdr: ChangeDetectorRef,
    public modal: NgbActiveModal,
    public contratoService: ContratosService,
    public toast: ToastrService
  ) {}

  ngOnInit(): void {
    console.log('ID recibido en el modal:', this.contratoId); // Verifica si el ID está llegando aquí
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
    if (!this.fecha_traslado) {
      this.toast.error('Validación', 'debe ingresar la fecha del traslado');
      return;
    }

    if (!this.direccion_traslado) {
      this.toast.error('Validación', 'debe ingresar la direccion del traslado');
      return;
    }

    this.isLoading = true;

    // Crear un nuevo objeto FormData
    let formData = new FormData();

    // Agregar los datos del formulario al FormData
    formData.append('hit_con_id', this.contratoId.toString()); // ID del contrato
    formData.append('hit_direccion_traspaso', this.direccion_traslado); // Dirección
    formData.append('hit_fecha_raspaso', this.fecha_traslado); // Fecha de traslado
    formData.append('hit_costo', this.costoTraslado.toString()); // Costo de traslado

    // Agregar el archivo PDF al FormData
    formData.append('pdfFile', this.file_name); // Archivo PDF
    // Llamar al servicio para registrar la empresa
    this.contratoService.registerTraslado(formData).subscribe((resp: any) => {
      console.log(resp);
      console.log('Respuesta del backend:', resp);
      if (resp.message == 403) {
        this.toast.error('Validación', resp.message_text);
      } else {
        this.toast.success('Exito', 'El traslado se registro con exito');
        this.TrasladoC.emit(resp.contrato);
        this.modal.close();
      }
    });
  }
}
