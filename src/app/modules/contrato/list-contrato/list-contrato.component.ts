import { Component } from '@angular/core';
import { ContratosService } from '../service/contratos.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateContratoComponent } from '../create-contrato/create-contrato.component';
import { EditContratoComponent } from '../edit-contrato/edit-contrato.component';
import { DeleteContratoComponent } from '../delete-contrato/delete-contrato.component';
import { PagosContratoComponent } from '../pagos-contrato/pagos-contrato.component';
import { TrasladoContratoComponent } from '../traslado-contrato/traslado-contrato.component';
import { VerContratoComponent } from '../ver-contrato/ver-contrato.component';
import { forkJoin } from 'rxjs';
import { CreatePagosContratoComponent } from '../create-pagos-contrato/create-pagos-contrato.component';

@Component({
  selector: 'app-list-contrato',
  templateUrl: './list-contrato.component.html',
  styleUrls: ['./list-contrato.component.scss'],
})
export class ListContratoComponent {
  search: string = '';
  CONTRATOS: any = [];
  VERCONTRATOS: any = [];
  TRASLADOS: any = [];
  PAGOS: any = [];
  isLoading$: any;

  cliente: any = [];
  servicio: any = [];
  pago: any = [];
  traslados: any = [];

  totalPages: number = 0;
  currentPage: number = 1;
  constructor(
    public modalService: NgbModal,
    public contratoService: ContratosService
  ) {}

  ngOnInit(): void {
    this.isLoading$ = this.contratoService.isLoading$;

    // Asegúrate de que los clientes estén cargados antes de listar los contratos

    this.listContratos();
    this.configAll();
  }

  listContratos(page = 1): void {
    this.contratoService.listContratos(page, this.search).subscribe({
      next: (resp: any) => {
        console.log('Respuesta del backend:', resp);

        // Asigna los contratos directamente desde la respuesta
        this.CONTRATOS = resp.contratos || [];

        console.log('Contratos obtenidos:', this.CONTRATOS);
        this.totalPages = resp.total || 0;
        this.currentPage = page;
      },
      error: (err: any) => {
        console.error('Error al obtener los contratos:', err);
        this.CONTRATOS = [];
      },
    });
  }

  configAll() {
    this.contratoService.configAll().subscribe((resp: any) => {
      // Imprimir la respuesta completa en la consola
      console.log('Respuesta completa:', resp);

      // Imprimir solo las propiedades específicas para ver si están presentes
      console.log('Clientes:', resp.clientes);
      console.log('Servicios:', resp.servicios);

      // Asignar los datos a las variables del componente
      this.cliente = resp.clientes;
      this.servicio = resp.servicios;
    });
  }

  PagosAll(contratoId: number) {
    this.contratoService.PagosAll(contratoId).subscribe((resp: any) => {
      // Imprimir la respuesta completa en la consola
      console.log('Respuesta de los pagos:', resp);

      // Imprimir solo las propiedades específicas para ver si están presentes
      console.log('Pagos:', resp.pagos);

      // Asignar los datos a las variables del componente
      this.pago = resp.pagos;
    });
  }

  loadPage($event: any) {
    this.listContratos($event);
  }

  createContrato() {
    const modalRef = this.modalService.open(CreateContratoComponent, {
      centered: true,
      size: 'md',
    });
    console.log('Clientes enviados al modal:', this.cliente); // Verifica que los datos sean correctos

    modalRef.componentInstance.clientes = this.cliente;
    modalRef.componentInstance.sucursales = this.servicio;

    modalRef.componentInstance.ContratoC.subscribe((contrato: any) => {
      this.CONTRATOS.unshift(contrato);
    });
  }

  editContrato(CONTRATO: any) {
    const modalRef = this.modalService.open(EditContratoComponent, {
      centered: true,
      size: 'md',
    });
    modalRef.componentInstance.CONTRATO_SELECTED = CONTRATO;
    modalRef.componentInstance.clientes = this.cliente;

    modalRef.componentInstance.ContratoE.subscribe((contrato: any) => {
      let INDEX = this.CONTRATOS.findIndex(
        (clie: any) => clie.id == CONTRATO.id
      );
      if (INDEX != -1) {
        this.CONTRATOS[INDEX] = contrato;
      }
    });
  }

  deleteContrato(CONTRATO: any) {
    console.log('ID del contrato seleccionado:', CONTRATO.id);
    const modalRef = this.modalService.open(DeleteContratoComponent, {
      centered: true,
      size: 'md',
    });
    modalRef.componentInstance.CONTRATO_SELECTED = CONTRATO;

    modalRef.componentInstance.ContratoD.subscribe((contrato: any) => {
      let INDEX = this.CONTRATOS.findIndex(
        (cont: any) => cont.id == CONTRATO.id
      );
      if (INDEX != -1) {
        this.CONTRATOS.splice(INDEX, 1);
      }
      // this.ROLES.unshift(role);
    });
  }

  UpdatePagos(CONTRATO: any) {
    console.log('ID del contrato seleccionado:', CONTRATO.id); // Verifica si se imprime correctamente

    const modalRef = this.modalService.open(PagosContratoComponent, {
      centered: true,
      size: 'md',
    });

    // Pasar el ID del contrato al modal
    modalRef.componentInstance.contratoId = CONTRATO.id; // Cambia 'id' por el nombre del campo real
  }

  Traslado(CONTRATO: any) {
    console.log('ID del contrato seleccionado:', CONTRATO.id); // Verifica si se imprime correctamente

    const modalRef = this.modalService.open(TrasladoContratoComponent, {
      centered: true,
      size: 'md',
    });

    // Pasar el ID del contrato al modal
    modalRef.componentInstance.contratoId = CONTRATO.id; // Cambia 'id' por el nombre del campo real
  }

  createTraslado() {
    const modalRef = this.modalService.open(TrasladoContratoComponent, {
      centered: true,
      size: 'md',
    });

    modalRef.componentInstance.TrasladoC.subscribe((traslado: any) => {
      this.TRASLADOS.unshift(traslado);
    });
  }

  VerContrato(CONTRATO: any) {
    console.log('ID del contrato seleccionado:', CONTRATO.id);
    console.log('Datos del contrato:', CONTRATO);
    console.log('ID Usuario del contrato:', CONTRATO.usurioreg);
    console.log('ID Cliente del contrato:', CONTRATO.cliente);
    console.log('Tipo de Servicio del contrato:', CONTRATO.tipocontrato);

    // Obtener IDs de servicios como un arreglo
    const servicioIds = CONTRATO.tipocontrato
      .split(',')
      .map((id: string) => parseInt(id.trim()));

    // Llamar a los servicios y pagos simultáneamente
    forkJoin({
      usuario: this.contratoService.UsuarioID(CONTRATO.usurioreg),
      cliente: this.contratoService.ClienteID(CONTRATO.cliente),
      servicios: forkJoin(
        servicioIds.map(
          (id: number) => this.contratoService.ServicioID(id) // Llamada por cada ID de servicio
        )
      ),
      pagos: this.contratoService.PagosAll(CONTRATO.id), // Llamada para obtener los pagos del contrato
      traslados: this.contratoService.TrasladoAll(CONTRATO.id), // Llamada para obtener los pagos del contrato
    }).subscribe({
      next: (resp: any) => {
        console.log('Datos del usuario con el ID contrato:', resp.usuario);
        console.log('Datos del cliente con el ID contrato:', resp.cliente);
        console.log('Datos de los servicios:', resp.servicios);

        // Verificar los pagos recibidos
        const pagosData = resp.pagos || [];
        console.log('Pagos recibidos:', pagosData);

        // Comprobar si los pagos corresponden al contrato
        if (pagosData.length > 0) {
          console.log('Pagos encontrados para el contrato ID:', CONTRATO.id);
        } else {
          console.log(
            'No se encontraron pagos para el contrato ID:',
            CONTRATO.id
          );
        }

        // Verificar los pagos recibidos
        const trasladosData = resp.traslados || [];
        console.log('traslados recibidos:', trasladosData);

        // Comprobar si los pagos corresponden al contrato
        if (trasladosData.length > 0) {
          console.log(
            'traslados encontrados para el contrato ID:',
            CONTRATO.id
          );
        } else {
          console.log(
            'No se encontraron traslados para el contrato ID:',
            CONTRATO.id
          );
        }

        // Verificar otros datos (usuario, cliente, servicios)
        const usuarioData = resp.usuario?.usuario?.[0] || null;
        if (!usuarioData) {
          console.error('No se encontraron datos de usuario');
          return;
        }

        const clienteData = resp.cliente?.cliente?.[0] || null;
        if (!clienteData) {
          console.error('No se encontraron datos de cliente');
          return;
        }

        const serviciosData = resp.servicios || [];
        if (serviciosData.length === 0) {
          console.error('No se encontraron datos de servicios');
          return;
        }

        // Pasar los datos al modal
        const modalRef = this.modalService.open(VerContratoComponent, {
          centered: true,
          size: 'md',
        });

        modalRef.componentInstance.CLIENTE_SELECTED = CONTRATO;
        modalRef.componentInstance.contratoId = CONTRATO.id;
        modalRef.componentInstance.usuarioDatos = usuarioData;
        modalRef.componentInstance.clienteDatos = clienteData;
        modalRef.componentInstance.servicioDatos = resp.servicios.map(
          (servicio: any) =>
            servicio.tipo && servicio.tipo.length ? servicio.tipo[0] : null
        );

        // Pasar los pagos al modal
        modalRef.componentInstance.pagosDatos = pagosData;
        modalRef.componentInstance.trasladosDatos = trasladosData;

        modalRef.componentInstance.ContratoV.subscribe((vercontratos: any) => {
          const INDEX = this.VERCONTRATOS.findIndex(
            (vercon: any) => vercon.id == CONTRATO.id
          );
          if (INDEX != -1) {
            this.VERCONTRATOS[INDEX] = vercontratos;
          }
        });
      },
      error: (error) => {
        console.error('Error al obtener datos:', error);
      },
    });
  }
}
