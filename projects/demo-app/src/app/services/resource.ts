import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/** Representa un personaje de la API de Rick & Morty. */
export interface Character {
  id: number;
  name: string;
  status: 'Alive' | 'Dead' | 'unknown';
  species: string;
  gender: string;
  origin: { name: string };
  location: { name: string };
  image: string;
  episode: string[];
  [key: string]: unknown;
}

/** Representa un episodio de la API de Rick & Morty. */
export interface Episode {
  id: number;
  name: string;
  air_date: string;
  episode: string;
  characters: string[];
  [key: string]: unknown;
}

/** Representa una locación de la API de Rick & Morty. */
export interface Location {
  id: number;
  name: string;
  type: string;
  dimension: string;
  residents: string[];
  [key: string]: unknown;
}

/** Tipos de recurso disponibles en la API. */
export type ResourceType = 'character' | 'episode' | 'location';

/** Unión de todos los tipos de recurso. */
export type AnyResource = Character | Episode | Location;

interface ApiInfo {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

const BASE_URL = 'https://rickandmortyapi.com/api';

/**
 * Servicio que gestiona el estado del explorador de recursos:
 * recurso activo, filtro de status, registros, loading, error y paginación.
 */
@Injectable({ providedIn: 'root' })
export class ResourceService {

  private http = inject(HttpClient);

  /** Recurso actualmente seleccionado. */
  resource = signal<ResourceType>('character');

  /** Filtro de status aplicado (vacío = sin filtro). */
  statusFilter = signal<string>('');

  /** Registros obtenidos de la API. */
  rows = signal<Record<string, unknown>[]>([]);

  /** Indica si hay una petición en curso. */
  loading = signal<boolean>(false);

  /** Mensaje de error si la petición falla. */
  errorMessage = signal<string | null>(null);

  /** Información de paginación de la API. */
  info = signal<ApiInfo>({ count: 0, pages: 0, next: null, prev: null });

  /** Página actual (1-based). */
  currentPage = computed<number>(() => {
    const n = this.info().next;
    if (!n) return this.info().pages || 1;
    const url = new URL(n);
    const p = url.searchParams.get('page');
    return p ? Number(p) - 1 : 1;
  });

  /** Total de registros disponibles. */
  totalCount = computed(() => this.info().count);

  /** Total de páginas. */
  totalPages = computed(() => this.info().pages);

  constructor() {
    this.fetchData();
  }

  /** Cambia el recurso activo, resetea el filtro y vuelve a cargar datos. */
  setResource(type: ResourceType): void {
    this.resource.set(type);
    this.statusFilter.set('');
    this.fetchData();
  }

  /** Aplica un filtro de status y vuelve a cargar datos. */
  setStatusFilter(status: string): void {
    this.statusFilter.set(status);
    this.fetchData();
  }

  /** Navega a la página siguiente. */
  nextPage(): void {
    const url = this.info().next;
    if (url) this.fetchUrl(url);
  }

  /** Navega a la página anterior. */
  prevPage(): void {
    const url = this.info().prev;
    if (url) this.fetchUrl(url);
  }

  /** Realiza la petición HTTP a la API de Rick & Morty. */
  fetchData(): void {
    const type = this.resource();
    const status = this.statusFilter();
    const params = new URLSearchParams();
    if (status) params.set('status', status);
    const qs = params.toString();
    const url = `${BASE_URL}/${type}${qs ? '?' + qs : ''}`;
    this.fetchUrl(url);
  }

  /** Realiza una petición a una URL concreta (para paginación). */
  private fetchUrl(url: string): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.http.get<{ info: ApiInfo; results: Record<string, unknown>[] }>(url).subscribe({
      next: (res) => {
        this.rows.set(res.results);
        this.info.set(res.info);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Error al cargar los datos. Intenta de nuevo.');
        this.loading.set(false);
      }
    });
  }
}
