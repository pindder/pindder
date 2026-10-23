import { Component, signal } from '@angular/core';
import { Sidebar } from '../../components/sidebar/sidebar';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-app-layout',
  imports: [Sidebar, RouterModule],
  templateUrl: './app-layout.html',
  styleUrl: './app-layout.css',
})
export class AppLayout {
  // Navigation & UI state signals
  isSidebarCollapsed = signal<boolean>(false);
  isMobileMenuOpen = signal<boolean>(false);
  isDarkMode = signal<boolean>(true);
  isNotificationsOpen = signal<boolean>(false);
  timeRange = signal<'7d' | '30d' | '90d'>('30d');

  toggleSidebar() {
    this.isSidebarCollapsed.update((val) => !val);
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen.update((val) => !val);
  }

  toggleTheme() {
    this.isDarkMode.update((val) => !val);
  }

  toggleNotifications() {
    this.isNotificationsOpen.update((val) => !val);
  }

  setTimeRange(range: '7d' | '30d' | '90d') {
    this.timeRange.set(range);
  }
}
