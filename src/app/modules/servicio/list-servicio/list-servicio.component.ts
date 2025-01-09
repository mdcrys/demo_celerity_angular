import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ServicioService } from '../service/servicio.service';
import { CreateServicioComponent } from '../create-servicio/create-servicio.component';
import { UpdateServicioComponent } from '../update-servicio/update-servicio.component';
import { DeleteServicioComponent } from '../delete-servicio/delete-servicio.component';

@Component({
  selector: 'app-list-servicio',
  templateUrl: './list-servicio.component.html',
  styleUrls: ['./list-servicio.component.scss'],
})
export class ListServicioComponent {
  search: string = '';
  SERVICIOS: any = [];
  isLoading$: any;

  totalPages: number = 0;
  currentPage: number = 1;
  constructor(
    public modalService: NgbModal,
    public servicioService: ServicioService
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading$ = this.servicioService.isLoading$;
    this.listServicio();
  }

  listServicio(page = 1) {
    this.servicioService
      .listServicios(page, this.search)
      .subscribe((resp: any) => {
        console.log('Respuesta del backend:', resp); // Para depurar
        this.SERVICIOS = resp.servicios; // Asigna correctamente los clientes
        console.log('Servicios asignados:', this.SERVICIOS); // Confirma la asignación
        this.totalPages = resp.total;
        this.currentPage = page;
      });
  }

  loadPage($event: any) {
    this.listServicio($event);
  }

  createServicio() {
    const modalRef = this.modalService.open(CreateServicioComponent, {
      centered: true,
      size: 'md',
    });

    modalRef.componentInstance.ServicioC.subscribe((servicio: any) => {
      this.SERVICIOS.unshift(servicio);
    });
  }

  editServicio(SERVICIO: any) {
    const modalRef = this.modalService.open(UpdateServicioComponent, {
      centered: true,
      size: 'md',
    });
    modalRef.componentInstance.SERVICIO_SELECTED = SERVICIO;

    modalRef.componentInstance.ServicioE.subscribe((servicio: any) => {
      let INDEX = this.SERVICIOS.findIndex(
        (serv: any) => serv.id == SERVICIO.id
      );
      if (INDEX != -1) {
        this.SERVICIOS[INDEX] = servicio;
      }
    });
  }

  deleteServicio(SERVICIO: any) {
    const modalRef = this.modalService.open(DeleteServicioComponent, {
      centered: true,
      size: 'md',
    });
    modalRef.componentInstance.SERVICIO_SELECTED = SERVICIO;

    modalRef.componentInstance.ServicioD.subscribe((cliente: any) => {
      let INDEX = this.SERVICIOS.findIndex(
        (serv: any) => serv.id == SERVICIO.id
      );
      if (INDEX != -1) {
        this.SERVICIOS.splice(INDEX, 1);
      }
      // this.ROLES.unshift(role);
    });
  }
}
