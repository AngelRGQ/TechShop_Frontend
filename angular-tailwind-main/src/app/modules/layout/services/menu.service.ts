import { Injectable, OnDestroy, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Menu } from 'src/app/core/constants/menu';
import { MenuItem, SubMenuItem } from 'src/app/core/models/menu.model';
import { SessionService } from 'src/app/core/services/session/session.service';

@Injectable({
  providedIn: 'root',
})
export class MenuService implements OnDestroy {
  private _showSidebar = signal(true);
  private _showMobileMenu = signal(false);
  private _pagesMenu = signal<MenuItem[]>([]);
  private _subscription = new Subscription();
  private _routerSubscription = new Subscription();

  constructor(private router: Router, private sessionService: SessionService) {
    this.setMenu();
    this._subscription.add(
      this.sessionService.identityChanges$.subscribe(() => {
        this.setMenu();
      })
    );
  }


  public setMenu() {
    this._routerSubscription.unsubscribe();
    this._routerSubscription = new Subscription();

    const identity = this.sessionService.getIdentity();

    if (!identity) {
      this._pagesMenu.set([]);
      return;
    }

    this._pagesMenu.set(this.filterMenuByGroup(Menu.pages, identity.rol));
    this.syncActiveState();

    const sub = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.syncActiveState();
      }
    });
    this._routerSubscription.add(sub);
  }

  get showSideBar() {
    return this._showSidebar();
  }
  get showMobileMenu() {
    return this._showMobileMenu();
  }
  get pagesMenu() {
    return this._pagesMenu();
  }

  set showSideBar(value: boolean) {
    this._showSidebar.set(value);
  }
  set showMobileMenu(value: boolean) {
    this._showMobileMenu.set(value);
  }

  public toggleSidebar() {
    this._showSidebar.set(!this._showSidebar());
  }

  public toggleMenu(menu: any) {
    this.showSideBar = true;
    menu.expanded = !menu.expanded;
  }

  public toggleSubMenu(submenu: SubMenuItem) {
    submenu.expanded = !submenu.expanded;
  }

  private expand(items: Array<any>) {
    items.forEach((item) => {
      item.expanded = this.isActive(item.route);
      if (item.children) this.expand(item.children);
    });
  }

  private isActive(instruction: any): boolean {
    return this.router.isActive(this.router.createUrlTree([instruction]), {
      paths: 'subset',
      queryParams: 'subset',
      fragment: 'ignored',
      matrixParams: 'ignored',
    });
  }

  ngOnDestroy(): void {
    this._routerSubscription.unsubscribe();
    this._subscription.unsubscribe();
  }

  public resetMenu() {
    this._pagesMenu.set([]);  // Limpiar el estado del menú
  }

  private filterMenuByGroup(menuItems: MenuItem[], role: string): MenuItem[] {
    return menuItems
      .filter(menu => {
        if (role === 'ADMIN') return true;
        if (role === 'VENDEDOR') return menu.group === 'CLIENTE';
        if (role === 'CLIENTE') return menu.group === 'CLIENTE';
        return false;
      })
      .map(menu => ({
        ...menu,
        items: menu.items
      }));
  }

  private syncActiveState(): void {
    this._pagesMenu().forEach((menu) => {
      let activeGroup = false;
      menu.items.forEach((subMenu) => {
        const active = this.isActive(subMenu.route);
        subMenu.expanded = active;
        subMenu.active = active;
        if (active) activeGroup = true;
        if (subMenu.children) {
          this.expand(subMenu.children);
        }
      });
      menu.active = activeGroup;
    });
  }
}
