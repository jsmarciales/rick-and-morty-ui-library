import { Component, ChangeDetectionStrategy, input, output, model, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/** Opción de un select. */
export interface SelectOption {
  /** Texto visible en el dropdown. */
  label: string;
  /** Valor interno de la opción. */
  value: string;
}

/**
 * Select estilizado con etiqueta, placeholder, estados de carga y deshabilitado.
 * Soporta two-way binding con model().
 *
 * @example
 * <ui-select
 *   label="Recurso"
 *   [options]="[{ label: 'Characters', value: 'character' }]"
 *   [(value)]="selected"
 *   (selectionChange)="onChange($event)">
 * </ui-select>
 */
@Component({
  selector: 'ui-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './select.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiSelectComponent {

  /** Lista de opciones disponibles. */
  options = input.required<SelectOption[]>();

  /** Etiqueta visible sobre el select. */
  label = input.required<string>();

  /** Texto cuando no hay selección. */
  placeholder = input<string>('Selecciona una opción');

  /** Estado de carga. */
  loading = input<boolean>(false);

  /** Bloquea la interacción. */
  disabled = input<boolean>(false);

  /** Two-way binding del valor seleccionado. */
  value = model<string | null>(null);

  /** Emite el objeto completo al cambiar la selección. */
  selectionChange = output<SelectOption>();

  /** Clases CSS dinámicas según estado. */
  selectClasses = computed(() => {
    const base = 'w-full bg-[#0a0f0a] border rounded-lg px-3 py-2 text-sm text-green-50 appearance-none focus:outline-none transition-all duration-200';
    const state = this.disabled() || this.loading()
      ? 'border-slate-700 opacity-50 cursor-not-allowed'
      : 'border-green-800 hover:border-green-500 focus:border-green-500';
    return `${base} ${state}`;
  });

  /** Actualiza el valor y emite el objeto SelectOption seleccionado. */
  onChange(val: string): void {
    const selected = this.options().find(o => o.value === val);
    if (selected) {
      this.value.set(val);
      this.selectionChange.emit(selected);
    }
  }
}
