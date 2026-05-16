import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourceService, ResourceType } from './services/resource';
import { UiButtonComponent } from 'ui-lib';
import { UiCardComponent } from 'ui-lib';
import { UiSelectComponent, SelectOption } from 'ui-lib';
import { UiTableComponent, TableColumn, TableAction } from 'ui-lib';

/**
 * Componente raíz de la demo app.
 * Integra los cuatro componentes de la librería para construir
 * un explorador de la API de Rick & Morty con tema verde portal.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    UiButtonComponent,
    UiCardComponent,
    UiSelectComponent,
    UiTableComponent
  ],
  templateUrl: './app.html',
})
export class App {

  resourceService = inject(ResourceService);

  /** Registro seleccionado para mostrar en el modal de detalle. */
  selectedModal: Record<string, unknown> | null = null;

  /** Registro pendiente de confirmación para eliminar. */
  pendingDelete: Record<string, unknown> | null = null;

  resourceOptions: SelectOption[] = [
    { label: 'Characters', value: 'character' },
    { label: 'Episodes', value: 'episode' },
    { label: 'Locations', value: 'location' }
  ];

  statusOptions: SelectOption[] = [
    { label: 'Alive', value: 'alive' },
    { label: 'Dead', value: 'dead' },
    { label: 'Unknown', value: 'unknown' }
  ];

  characterColumns: TableColumn[] = [
    { key: 'image', header: 'Avatar', type: 'image' as const },
    { key: 'name', header: 'Nombre' },
    { key: 'status', header: 'Status' },
    { key: 'species', header: 'Especie' },
    { key: 'gender', header: 'Género' }
  ];

  episodeColumns: TableColumn[] = [
    { key: 'name', header: 'Nombre' },
    { key: 'episode', header: 'Episodio' },
    { key: 'air_date', header: 'Fecha' }
  ];

  locationColumns: TableColumn[] = [
    { key: 'name', header: 'Nombre' },
    { key: 'type', header: 'Tipo' },
    { key: 'dimension', header: 'Dimensión' }
  ];

  /** Columnas dinámicas según el recurso activo. */
  get columns(): TableColumn[] {
    const r = this.resourceService.resource();
    if (r === 'episode') return this.episodeColumns;
    if (r === 'location') return this.locationColumns;
    return this.characterColumns;
  }

  /** Nombre legible del recurso activo. */
  resourceLabel = computed(() => {
    const r = this.resourceService.resource();
    if (r === 'character') return 'Personajes';
    if (r === 'episode') return 'Episodios';
    return 'Locaciones';
  });

  /** Stats del recurso actual desde los datos visibles. */
  aliveCount = computed(() =>
    this.resourceService.rows().filter(r => r['status'] === 'Alive').length
  );

  deadCount = computed(() =>
    this.resourceService.rows().filter(r => r['status'] === 'Dead').length
  );

  unknownCount = computed(() =>
    this.resourceService.rows().filter(r => r['status'] === 'unknown').length
  );

  /** Cambia el recurso activo en el servicio. */
  onResourceChange(option: SelectOption): void {
    this.resourceService.setResource(option.value as ResourceType);
  }

  /** Aplica filtro de status en el servicio. */
  onStatusChange(option: SelectOption): void {
    this.resourceService.setStatusFilter(option.value);
  }

  /** Maneja las acciones emitidas por la tabla (ver / eliminar). */
  onAction(event: TableAction<Record<string, unknown>>): void {
    if (event.action === 'view') {
      this.selectedModal = event.row;
    } else {
      this.pendingDelete = event.row;
    }
  }

  /** Confirma la eliminación y cierra el diálogo. */
  confirmDelete(): void {
    this.pendingDelete = null;
  }

  /** Cancela la eliminación y cierra el diálogo. */
  cancelDelete(): void {
    this.pendingDelete = null;
  }

  /** Cierra el modal de detalle. */
  closeModal(): void {
    this.selectedModal = null;
  }

  /** Verifica si un registro es de tipo Character. */
  isCharacter(row: Record<string, unknown>): boolean {
    return 'species' in row;
  }

  /** Verifica si un registro es de tipo Episode. */
  isEpisode(row: Record<string, unknown>): boolean {
    return 'air_date' in row;
  }

  /** Verifica si un registro es de tipo Location. */
  isLocation(row: Record<string, unknown>): boolean {
    return 'dimension' in row;
  }

  /** Obtiene un valor del registro como string. */
  getStr(row: Record<string, unknown>, key: string): string {
    return String(row[key] ?? '');
  }

  /** Extrae el nombre del origen de un personaje. */
  getOriginName(row: Record<string, unknown>): string {
    const origin = row['origin'] as { name: string } | undefined;
    return origin?.name ?? '';
  }

  /** Extrae el nombre de la ubicación de un personaje. */
  getLocationName(row: Record<string, unknown>): string {
    const location = row['location'] as { name: string } | undefined;
    return location?.name ?? '';
  }

  /** Color del indicador de status. */
  statusColor(row: Record<string, unknown>): string {
    const s = String(row['status'] ?? '').toLowerCase();
    if (s === 'alive') return 'bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.6)]';
    if (s === 'dead') return 'bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.6)]';
    return 'bg-slate-500';
  }
}
