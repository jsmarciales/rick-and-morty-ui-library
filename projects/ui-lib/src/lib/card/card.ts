import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Tarjeta con header (título, subtítulo) y body proyectado vía ng-content.
 * El header es clickeable y emite un evento.
 *
 * @example
 * <ui-card title="Rick Sanchez" subtitle="Human" elevation="raised" (headerClicked)="close()">
 *   <p>Contenido del body...</p>
 * </ui-card>
 */
@Component({
  selector: 'ui-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiCardComponent {

  /** Título del header de la card. */
  title = input.required<string>();

  /** Subtítulo opcional bajo el título. */
  subtitle = input<string | null>(null);

  /** Estilo visual del contenedor. */
  elevation = input<'flat' | 'raised' | 'outlined'>('raised');

  /** Emite al hacer clic en el header. */
  headerClicked = output<void>();

  /** Clases CSS dinámicas según elevation. */
  cardClasses = computed(() => {
    const base = 'rounded-xl overflow-hidden border transition-all duration-200';

    const elevations: Record<string, string> = {
      flat: 'bg-[#0a0f0a] border-transparent',
      raised: 'bg-[#0a0f0a] border-green-900/40 shadow-lg shadow-black/40',
      outlined: 'bg-transparent border-green-500/50'
    };

    return `${base} ${elevations[this.elevation()]}`;
  });

  /** Maneja el click en el header. */
  onHeaderClick(): void {
    this.headerClicked.emit();
  }
}
