import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { Router } from '@angular/router';
import { admin_menus, IAdminMenu, IProfile } from '@pindder/contracts';

@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit{
  // Navigation & UI state signals
  @Input() isMobileMenuOpen = signal<boolean>(false);
  @Input() isDarkMode = signal<boolean>(true);
  @Input() isNotificationsOpen = signal<boolean>(false);

  @Output() toggleDarkMode = new EventEmitter();
  
  private router = inject(Router);

  isSidebarCollapsed = signal<boolean>(false);
  activeNav = signal<number>(1);
  timeRange = signal<'7d' | '30d' | '90d'>('30d');

  // Sidebar Menu Items
  navItems = signal<IAdminMenu[]>(admin_menus);
  profile = signal<IProfile | null>(null);

  ngOnInit(): void {
    const profile = sessionStorage.getItem('user');
    const activeNav = sessionStorage.getItem('activeNav');

    if(profile) {
      this.profile.set(JSON.parse(profile));
      console.log(this.profile());
      if(activeNav) {
      this.activeNav.set(JSON.parse(activeNav));
    }
    } else {
      this.router.navigate(['auth/login']);
    }
  }

  toggleSidebar() {
    this.isSidebarCollapsed.update((val: boolean) => !val);
  }

  toggleTheme() {
    this.isDarkMode.update((val: boolean) => !val);
    this.toggleDarkMode.emit(this.isDarkMode());
  }

  setActiveNav(menu: IAdminMenu) {
    sessionStorage.setItem('activeNav', JSON.stringify(menu.id));
    this.activeNav.set(menu.id);
    this.router.navigate([menu.path]);
  }
}
