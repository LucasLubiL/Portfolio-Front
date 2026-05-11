import { Component, OnInit } from '@angular/core';
import { Header } from '../../shared/header/header';
import { Footer } from '../../shared/footer/footer';
import { DevService } from '../../service/dev.service';
import { FormsModule } from '@angular/forms';
import { CommonModule  } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';



@Component({
  selector: 'app-home',
  imports: [Header, Footer, FormsModule, CommonModule ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  dev: any = null;
  editMode = false;
  aboutEdit = '';

  constructor(private devService: DevService,
              private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.carregarDev();

  }

  carregarDev() {
    this.devService.buscarDev(1).subscribe({
      next: (data) => {
        this.dev = structuredClone(data);

        console.log('DEV carregado:', this.dev);

        this.cdr.detectChanges(); // 👈 ISSO AQUI resolve
      },
      error: (err) => {
        console.error('Erro ao buscar dev', err);
      },
    });
  }

  abrirEdicao(): void {
    console.log('clicou no editar');
    if (!this.dev) return;
    console.log('TEM DEV COM ABOUT');
    this.editMode = true;
    this.aboutEdit = this.dev.about;

  }

  fecharEdicao(): void {
    this.editMode = false;
  }

  salvar(): void {
    const atualizado = {
      id_dev: this.dev.id_dev,
      name: this.dev.name,
      about: this.aboutEdit
    };

    console.log('ENVIANDO:', JSON.stringify(atualizado));

    this.devService.atualizarDev(this.dev.id_dev, atualizado)
      .subscribe((data) => {
        this.dev = data;
        this.editMode = false;
      });
  }
}
