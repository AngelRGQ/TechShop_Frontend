import { Injectable, signal } from '@angular/core';
import { effect } from '@angular/core';
import { Theme } from '../models/theme.model';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  // SIEMPRE forzar light
  public theme = signal<Theme>({ mode: 'light', color: 'base' });

  constructor() {
    this.loadTheme();
    effect(() => {
      this.setTheme();
    });
  }

  private loadTheme() {
    const theme = localStorage.getItem('theme');
    if (theme) {
      const parsedTheme = JSON.parse(theme);
      // FORZAR siempre light, solo mantener el color
      this.theme.set({ 
        mode: 'light',  // ← Siempre light
        color: parsedTheme.color || 'base' 
      });
    } else {
      // Si no hay tema guardado, forzar light
      this.theme.set({ mode: 'light', color: 'base' });
    }
  }

  private setTheme() {
    // Guardar siempre con mode: 'light'
    const themeToSave = { 
      mode: 'light' as const,  // ← Siempre light
      color: this.theme().color 
    };
    localStorage.setItem('theme', JSON.stringify(themeToSave));
    this.setThemeClass();
  }

  public get isDark(): boolean {
    return false; // ← Siempre retornar false
  }

  private setThemeClass() {
    // Siempre establecer 'light'
    document.querySelector('html')!.className = 'light';
    document.querySelector('html')!.setAttribute('data-theme', this.theme().color);
  }
}