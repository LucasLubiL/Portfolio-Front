import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { Header } from '../../shared/header/header';
import { Footer } from '../../shared/footer/footer';
import { DevService } from '../../service/dev.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TechnologyService } from '../../service/technology.service';
import { ProjectsService } from '../../service/projects.service';

@Component({
  selector: 'app-home',
  imports: [Header, Footer, FormsModule, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {

  dev: any = null;
  editMode = false;
  aboutEdit = '';

  mostrarModalTech = false;
  mostrarModalNovaTech = false;
  mostrarModalConfirmDelete = false;

  technologies: any[] = [];

  linguagens: any[] = [];
  backend: any[] = [];
  frontend: any[] = [];
  banco: any[] = [];
  outros: any[] = [];

  novaTech = { nome: '', tipo: '' };
  editandoTech: any = null;
  techParaDeletar: any = null;

  // 🔒 trava contra double click
  loadingTechAction = false;

  constructor(
    private devService: DevService,
    private technologyService: TechnologyService,
    private zone: NgZone,
    private cdr: ChangeDetectorRef,
    private projectsService: ProjectsService
  ) {}

  ngOnInit() {
    this.carregarDev();
    this.carregarTechnologies();
    this.carregarProjects();
    this.carregarTechnologiesParaProjetos();
  }

  // ================= DEV =================

  carregarDev() {
    this.devService.buscarDev(1).subscribe(data => {
      this.zone.run(() => {
        this.dev = data;
        this.cdr.detectChanges();
      });
    });
  }

  abrirEdicao() {
    this.editMode = true;
    this.aboutEdit = this.dev?.about || '';
  }

  fecharEdicao() {
    this.editMode = false;
  }

  salvar() {
    this.devService.atualizarDev(this.dev.id_dev, {
      id_dev: this.dev.id_dev,
      name: this.dev.name,
      about: this.aboutEdit
    }).subscribe(data => {
      this.zone.run(() => {
        this.dev = data;
        this.editMode = false;
        this.cdr.detectChanges();
      });
    });
  }

  // ================= TECH =================

  carregarTechnologies() {
    this.technologyService.getAll().subscribe(data => {
      this.zone.run(() => {
        this.technologies = [...data];
        this.atualizarGrupos();
        this.cdr.detectChanges();
      });
    });
  }

  atualizarGrupos() {
    this.linguagens = this.technologies.filter(t => t.tipo === 'Linguagens');
    this.backend = this.technologies.filter(t => t.tipo === 'Backend');
    this.frontend = this.technologies.filter(t => t.tipo === 'Frontend');
    this.banco = this.technologies.filter(t => t.tipo === 'Banco de Dados');
    this.outros = this.technologies.filter(t => t.tipo === 'Outros');
  }

  // ================= MODAIS =================

  abrirModalTech() {
    this.mostrarModalTech = true;
  }

  fecharModalTech() {
    this.mostrarModalTech = false;
    this.editandoTech = null;
  }

  abrirModalNovaTech() {
    this.mostrarModalNovaTech = true;
    this.novaTech = { nome: '', tipo: '' };
  }

  fecharModalNovaTech() {
    this.mostrarModalNovaTech = false;
  }

  // ================= CREATE =================

  adicionarTech() {
    if (this.loadingTechAction) return;
    this.loadingTechAction = true;

    // 🔥 FECHA IMEDIATAMENTE (resolve seu bug de double click)
    this.fecharModalNovaTech();

    this.technologyService.create(this.novaTech)
      .subscribe(nova => {
        this.zone.run(() => {

          this.technologies = [...this.technologies, nova];

          this.atualizarGrupos();

          this.novaTech = { nome: '', tipo: '' };

          this.loadingTechAction = false;

          this.cdr.detectChanges();
        });
      });
  }

  // ================= EDIT =================

  editarTech(tech: any) {
    this.editandoTech = { ...tech };
  }

  salvarEdicaoTech() {
    if (!this.editandoTech || this.loadingTechAction) return;

    this.loadingTechAction = true;

    const payload = { ...this.editandoTech };

    this.technologyService.update(
      payload.id_technology,
      payload
    ).subscribe(updated => {

      this.zone.run(() => {

        this.technologies = this.technologies.map(t =>
          t.id_technology === updated.id_technology ? updated : t
        );

        this.editandoTech = null;

        this.atualizarGrupos();

        this.loadingTechAction = false;

        this.cdr.detectChanges();
      });
    });
  }

  // ================= DELETE =================

  abrirConfirmacaoDelete(tech: any) {
    this.techParaDeletar = tech;
    this.mostrarModalConfirmDelete = true;
  }

  cancelarDelete() {
    this.techParaDeletar = null;
    this.mostrarModalConfirmDelete = false;
  }

  confirmarDelete() {
    if (!this.techParaDeletar || this.loadingTechAction) return;

    this.loadingTechAction = true;

    const id = this.techParaDeletar.id_technology;

    // 🔥 FECHA MODAL NA HORA (resolve double click)
    this.mostrarModalConfirmDelete = false;

    this.technologyService.delete(id).subscribe(() => {
      this.zone.run(() => {

        this.technologies = this.technologies.filter(
          t => t.id_technology !== id
        );

        this.atualizarGrupos();

        this.techParaDeletar = null;
        this.loadingTechAction = false;

        this.cdr.detectChanges();
      });
    });
  }












  // ================= PROJECTS =================

  projects: any[] = [];

  menuAberto: number | null = null;

  mostrarModalEditProject = false;
  mostrarModalCreateProject = false;

  projectParaDeletar: any = null;

// ================= EDIT =================

  editProjectId: number | null = null;

  editProject: any = {
    titulo: '',
    about: '',
    github: '',
    imageUrl: ''
  };

  editProjectTechIds: number[] = [];

  selectedImageFile: File | null = null;

// ================= CREATE =================

  createProject: any = {
    titulo: '',
    about: '',
    github: ''
  };

  createProjectTechIds: number[] = [];

  createImageFile: File | null = null;

// ================= GLOBAL =================

  allTechnologies: any[] = [];

// ================= LOAD =================

  carregarProjects() {
    this.projectsService.listar().subscribe(data => {
      this.projects = data || [];
    });
  }

  carregarTechnologiesParaProjetos() {
    this.technologyService.getAll().subscribe(data => {
      this.allTechnologies = data || [];
      this.cdr.detectChanges();
    });
  }

// ================= MENU =================

  toggleMenu(id: number) {
    this.menuAberto = this.menuAberto === id ? null : id;
  }

// ================= DELETE =================

  abrirConfirmDeleteProject(p: any) {
    this.projectParaDeletar = p;
    this.menuAberto = null;
  }

  deletarProject() {

    if (!this.projectParaDeletar?.id_project) return;

    const id = this.projectParaDeletar.id_project;

    this.projectsService.deletar(id)
      .subscribe(() => {

        this.projects = this.projects.filter(p => p.id_project !== id);

        this.projectParaDeletar = null;
      });
  }

  fecharModalDeleteProject() {
    this.projectParaDeletar = null;
  }

// ================= EDIT =================

  editarProject(p: any) {

    this.menuAberto = null;

    this.editProjectId = p.id_project;

    this.editProject = {
      titulo: p.titulo,
      about: p.about,
      github: p.github,
      imageUrl: p.imageUrl
    };

    this.editProjectTechIds =
      p.technologies?.map((t: any) => t.id_technology) || [];

    this.selectedImageFile = null;

    this.mostrarModalEditProject = true;
  }

  fecharModalEditProject() {

    this.mostrarModalEditProject = false;

    this.editProject = {
      titulo: '',
      about: '',
      github: '',
      imageUrl: ''
    };

    this.editProjectTechIds = [];
    this.selectedImageFile = null;
    this.editProjectId = null;
  }

  onImageChange(event: any) {
    const file = event.target.files[0];
    if (file) this.selectedImageFile = file;
  }

  adicionarTechNoProjeto(event: any) {

    const id = Number(event.target.value);

    if (!id) return;

    if (!this.editProjectTechIds.includes(id)) {
      this.editProjectTechIds.push(id);
    }

    event.target.value = '';
  }

  removerTechDoProjeto(id: number) {
    this.editProjectTechIds =
      this.editProjectTechIds.filter(t => t !== id);
  }

  getTechName(id: number) {
    return this.allTechnologies.find(t => t.id_technology === id)?.nome || '';
  }

  salvarProjectEdit() {

    if (!this.editProjectId) return;

    const formData = new FormData();

    formData.append('titulo', this.editProject.titulo);
    formData.append('about', this.editProject.about);
    formData.append('github', this.editProject.github);

    this.editProjectTechIds.forEach(id => {
      formData.append('technologies', id.toString());
    });

    if (this.selectedImageFile) {
      formData.append('image', this.selectedImageFile);
    }

    const id = this.editProjectId;

    this.projectsService.atualizarProjeto(id, formData)
      .subscribe((updated: any) => {

        this.projects = this.projects.map(p =>
          p.id_project === updated.id_project ? updated : p
        );

        // 🔥 FECHA SÓ AQUI
        this.fecharModalEditProject();
      });
  }

// ================= CREATE =================

  abrirModalNovoProject() {
    this.mostrarModalCreateProject = true;
  }

  fecharModalCreateProject() {

    this.mostrarModalCreateProject = false;

    this.createProject = {
      titulo: '',
      about: '',
      github: ''
    };

    this.createProjectTechIds = [];
    this.createImageFile = null;
  }

  onCreateImageChange(event: any) {
    const file = event.target.files[0];
    if (file) this.createImageFile = file;
  }

  adicionarTechNoCreate(event: any) {

    const id = Number(event.target.value);

    if (!id) return;

    if (!this.createProjectTechIds.includes(id)) {
      this.createProjectTechIds.push(id);
    }

    event.target.value = '';
  }

  removerTechDoCreate(id: number) {
    this.createProjectTechIds =
      this.createProjectTechIds.filter(t => t !== id);
  }

  salvarNovoProject() {

    const formData = new FormData();

    formData.append('titulo', this.createProject.titulo);
    formData.append('about', this.createProject.about);
    formData.append('github', this.createProject.github);

    this.createProjectTechIds.forEach(id => {
      formData.append('technologies', id.toString());
    });

    if (this.createImageFile) {
      formData.append('image', this.createImageFile);
    }

    this.projectsService.criar(formData)
      .subscribe((created: any) => {

        this.projects = [...this.projects, created];

        // 🔥 FECHA DEPOIS DO SUCCESS
        this.fecharModalCreateProject();
      });
  }

}
