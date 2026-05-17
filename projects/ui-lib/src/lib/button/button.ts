import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

/** Botón. */
@Component({
  selector: 'ui-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiButtonComponent {

  /** Texto visible del botón. */
  label = input.required<string>();

  /** Estilo visual del botón. */
  variant = input<'primary' | 'secondary' | 'danger'>('primary');

  /** Tamaño del botón. */
  size = input<'sm' | 'md' | 'lg'>('md');

  /** Bloquea la interacción. */
  disabled = input<boolean>(false);

  /** Muestra spinner y bloquea el click. */
  loading = input<boolean>(false);

  /** Emite solo si no está disabled ni loading. */
  clicked = output<void>();

  /** Clases CSS dinámicas según variant y size. */
  buttonClasses = computed(() => {
    const base = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none';

    const sizes: Record<string, string> = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-5 py-2 text-base',
      lg: 'px-7 py-3 text-lg'
    };

    const variants: Record<string, string> = {
      primary: 'bg-green-500 text-black font-semibold hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed',
      secondary: 'bg-transparent border border-green-500 text-green-400 hover:bg-green-500/10 disabled:opacity-50 disabled:cursor-not-allowed',
      danger: 'bg-red-600 text-white hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed'
    };

    return `${base} ${sizes[this.size()]} ${variants[this.variant()]}`;
  });

  /** Maneja el click verificando disabled y loading. */
  handleClick(): void {
    if (!this.disabled() && !this.loading()) {
      this.clicked.emit();
    }
  }
}
