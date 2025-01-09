import { Component } from '@angular/core';
import { EmpresasService } from '../service/empresas.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateEmpresaComponent } from '../create-empresa/create-empresa.component';
import { UpdateEmpresaComponent } from '../update-empresa/update-empresa.component';
import { DeleteEmpresaComponent } from '../delete-empresa/delete-empresa.component';

@Component({
  selector: 'app-list-empresas',
  templateUrl: './list-empresas.component.html',
  styleUrls: ['./list-empresas.component.scss'],
})
export class ListEmpresasComponent {
  search: string = '';
  EMPRESAS: any = [];
  isLoading$: any;

  totalPages: number = 0;
  currentPage: number = 1;
  constructor(
    public modalService: NgbModal,
    public empresaService: EmpresasService
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading$ = this.empresaService.isLoading$;
    this.listEmpresas();
  }

  listEmpresas(page = 1) {
    this.empresaService
      .listEmpresas(page, this.search)
      .subscribe((resp: any) => {
        console.log('Respuesta del backend:', resp); // Verifica los datos recibidos
        this.EMPRESAS = resp.empresa; // Asigna los datos correctamente
        console.log('EMPRESAS asignadas:', this.EMPRESAS); // Verifica la asignación
        this.totalPages = resp.total;
        this.currentPage = page;
      });
  }

  loadPage($event: any) {
    this.listEmpresas($event);
  }

  createEmpresa() {
    const modalRef = this.modalService.open(CreateEmpresaComponent, {
      centered: true,
      size: 'md',
    });

    modalRef.componentInstance.EmpresaC.subscribe((empresa: any) => {
      this.EMPRESAS.unshift(empresa);
    });
  }

  editEmpresa(EMPRESA: any) {
    const modalRef = this.modalService.open(UpdateEmpresaComponent, {
      centered: true,
      size: 'md',
    });
    modalRef.componentInstance.EMPRESA_SELECTED = EMPRESA;

    modalRef.componentInstance.EmpresaE.subscribe((empresa: any) => {
      let INDEX = this.EMPRESAS.findIndex((empr: any) => empr.id == EMPRESA.id);
      if (INDEX != -1) {
        this.EMPRESAS[INDEX] = empresa;
      }
    });
  }

  deleteEmpresa(EMPRESA: any) {
    const modalRef = this.modalService.open(DeleteEmpresaComponent, {
      centered: true,
      size: 'md',
    });
    modalRef.componentInstance.EMPRESA_SELECTED = EMPRESA;

    modalRef.componentInstance.EmpresaD.subscribe((empresa: any) => {
      let INDEX = this.EMPRESAS.findIndex((empr: any) => empr.id == EMPRESA.id);
      if (INDEX != -1) {
        this.EMPRESAS.splice(INDEX, 1);
      }
      // this.ROLES.unshift(role);
    });
  }
}
