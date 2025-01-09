import { ChangeDetectorRef, Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateContratoComponent } from '../../contrato/create-contrato/create-contrato.component';
import { ContratosService } from '../../contrato/service/contratos.service';
import { CreateDebitoComponent } from '../create-debito/create-debito.component';
import { DebitoService } from '../service/debito.service';
import { UpdateDebitoComponent } from '../update-debito/update-debito.component';
import { DeleteDebitoComponent } from '../delete-debito/delete-debito.component';

@Component({
  selector: 'app-list-debito',
  templateUrl: './list-debito.component.html',
  styleUrls: ['./list-debito.component.scss'],
})
export class ListDebitoComponent {
  search: string = '';
  isLoading$: any;
  DEBITOS: any = [];
  // Define la URL base
  URL_SERVICIOS: string = 'http://localhost:8000';

  totalPages: number = 0;
  currentPage: number = 1;
  constructor(
    public modalService: NgbModal,
    public contratoService: ContratosService,
    public debitoService: DebitoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.isLoading$ = this.contratoService.isLoading$;
    this.listDebitos();
  }

  listDebitos(page = 1) {
    this.debitoService.listDebitos(page, this.search).subscribe(
      (resp: any) => {
        console.log('Datos asignados a DEBITOS:', resp.autorizacion_debito);
        this.DEBITOS = resp.autorizacion_debito;
        this.totalPages = resp.total;
        this.currentPage = page;
        this.cdr.detectChanges(); // Fuerza la detección de cambios
      },
      (error) => {
        console.error('Error al obtener los débitos:', error);
      }
    );
  }

  loadPage($event: any) {
    this.listDebitos($event);
  }
  createDebito() {
    const modalRef = this.modalService.open(CreateDebitoComponent, {
      centered: true,
      size: 'md',
    });

    modalRef.componentInstance.DebitoC.subscribe((debito: any) => {
      this.DEBITOS.unshift(debito);
    });
  }

  editDebito(DEBITO: any) {
    const modalRef = this.modalService.open(UpdateDebitoComponent, {
      centered: true,
      size: 'md',
    });
    modalRef.componentInstance.DEBITO_SELECTED = DEBITO;

    modalRef.componentInstance.DebitoE.subscribe((debito: any) => {
      let INDEX = this.DEBITOS.findIndex((deb: any) => deb.id == DEBITO.id);
      if (INDEX != -1) {
        this.DEBITOS[INDEX] = debito;
      }
    });
  }

  deleteDebito(DEBITO: any) {
    const modalRef = this.modalService.open(DeleteDebitoComponent, {
      centered: true,
      size: 'md',
    });
    modalRef.componentInstance.DEBITO_SELECTED = DEBITO;

    modalRef.componentInstance.DebitoD.subscribe((debito: any) => {
      let INDEX = this.DEBITOS.findIndex((deb: any) => deb.id == DEBITO.id);
      if (INDEX != -1) {
        this.DEBITOS.splice(INDEX, 1);
      }
      // this.ROLES.unshift(role);
    });
  }
}
