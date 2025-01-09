import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientesService } from '../service/clientes.service';
import { CreateClienteComponent } from '../create-cliente/create-cliente.component';
import { UpdateClienteComponent } from '../update-cliente/update-cliente.component';
import { DeleteClienteComponent } from '../delete-cliente/delete-cliente.component';

@Component({
  selector: 'app-list-cliente',
  templateUrl: './list-cliente.component.html',
  styleUrls: ['./list-cliente.component.scss'],
})
export class ListClienteComponent {
  search: string = '';
  CLIENTES: any = [];
  isLoading$: any;

  totalPages: number = 0;
  currentPage: number = 1;
  constructor(
    public modalService: NgbModal,
    public clienteService: ClientesService
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading$ = this.clienteService.isLoading$;
    this.listClientes();
  }

  listClientes(page = 1) {
    this.clienteService
      .listClientes(page, this.search)
      .subscribe((resp: any) => {
        console.log(resp);
        this.CLIENTES = resp.cliente_person;
        this.totalPages = resp.total;
        this.currentPage = page;
      });
  }

  loadPage($event: any) {
    this.listClientes($event);
  }

  createCliente() {
    const modalRef = this.modalService.open(CreateClienteComponent, {
      centered: true,
      size: 'md',
    });

    modalRef.componentInstance.ClienteC.subscribe((cliente: any) => {
      this.CLIENTES.unshift(cliente);
    });
  }

  editCliente(CLIENTE: any) {
    const modalRef = this.modalService.open(UpdateClienteComponent, {
      centered: true,
      size: 'md',
    });
    modalRef.componentInstance.CLIENTE_SELECTED = CLIENTE;

    modalRef.componentInstance.ClienteE.subscribe((cliente: any) => {
      let INDEX = this.CLIENTES.findIndex((clie: any) => clie.id == CLIENTE.id);
      if (INDEX != -1) {
        this.CLIENTES[INDEX] = cliente;
      }
    });
  }

  deleteCliente(CLIENTE: any) {
    const modalRef = this.modalService.open(DeleteClienteComponent, {
      centered: true,
      size: 'md',
    });
    modalRef.componentInstance.CLIENTE_SELECTED = CLIENTE;

    modalRef.componentInstance.ClienteD.subscribe((cliente: any) => {
      let INDEX = this.CLIENTES.findIndex((clie: any) => clie.id == CLIENTE.id);
      if (INDEX != -1) {
        this.CLIENTES.splice(INDEX, 1);
      }
      // this.ROLES.unshift(role);
    });
  }
}
