import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

/** Definición de una columna de la tabla. */
export interface TableColumn {
  /** Clave para acceder al valor en la fila. */
  key: string;
  /** Texto visible en el encabezado. */
  header: string;
  /** Tipo de renderizado de la celda. */
  type?: 'text' | 'image';
}

/** Acción emitida por la tabla al interactuar con una fila. */
export interface TableAction<T> {
  /** Tipo de acción ejecutada. */
  action: 'view' | 'delete';
  /** Fila sobre la que se ejecutó la acción. */
  row: T;
}

@Component({
  selector: 'ui-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiTableComponent<T extends Record<string, unknown> = Record<string, unknown>> {

  /** Definición de columnas. */
  columns = input.required<TableColumn[]>();

  /** Datos a renderizar. */
  rows = input.required<T[]>();

  /** Muestra skeleton rows mientras carga. */
  loading = input<boolean>(false);

  /** Mensaje cuando rows está vacío. */
  emptyMessage = input<string>('No hay resultados');

  /** Mensaje de error de red. */
  errorMessage = input<string | null>(null);

  /** Emite la acción y la fila correspondiente. */
  actionTriggered = output<TableAction<T>>();

  skeletonRows = Array(5).fill(null);

  /** Emite acción 'view' con la fila. */
  onView(row: T): void {
    this.actionTriggered.emit({ action: 'view', row });
  }

  /** Emite acción 'delete' con la fila. */
  onDelete(row: T): void {
    this.actionTriggered.emit({ action: 'delete', row });
  }

  /** Formatea el valor de una celda: si es objeto extrae .name, si no lo convierte a string. */
  formatValue(row: T, key: string): string {
    const val = row[key] as unknown;
    if (val && typeof val === 'object' && 'name' in (val as Record<string, unknown>)) {
      return String((val as Record<string, unknown>)['name']);
    }
    return String(val ?? '');
  }
}
