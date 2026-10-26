import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule  } from '@angular/forms';
import { AppService } from '../../services/app.service';
import { AccountStatus, AdminRoles, IAdminTeamMate, IResponse } from '@pindder/contracts';
import { HttpErrorResponse } from '@angular/common/http';

interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'Editor' | 'Viewer' | 'Manager' | 'Billing';
  status: 'Active' | 'Pending';
  avatar: string;
}

interface ToastNotification {
  id: number;
  message: string;
  type: 'success' | 'info' | 'warning' | 'danger';
}

@Component({
  selector: 'app-teams',
  imports: [FormsModule, CommonModule],
  templateUrl: './teams.html',
  styleUrl: './teams.css',
})
export class Teams implements OnInit{
  private appService = inject(AppService);

  activeModal = signal<'addMember' | 'deleteAccount' | null>(null);
  searchQuery = signal<string>('');
  toasts = signal<ToastNotification[]>([]);
  deleteConfirmText = signal<string>('');

  roles = AdminRoles;
  adminRoles = Object.keys(AdminRoles);
  accountStatus = AccountStatus;
  status = Object.keys(AccountStatus);
  teamMembers = signal<IAdminTeamMate[]>([]);
  newMember = signal<IAdminTeamMate | null>({
    email: '',
    roles: [],
    firstname: '',
    lastname: '',
    countryCode: '',
    tel: '',
    country: '',
    state: '',
    profileImg: '',
    formattedPhoneNo: '',
    fullname: '',
    status: ''
  })

  ngOnInit(): void {
    this.fetchAdmins();
  }

  fetchAdmins() {
    this.appService.getAdminAccounts().subscribe({
      next: (response: IResponse<IAdminTeamMate[]>) => {
        if(response.data) {
          this.teamMembers.update(currentTeammates => [
            ...currentTeammates ?? [],
            ...response.data ?? []
          ]);
          this.filteredTeamMembers();
        }
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      }
    })
  }

  // Search & Team Table Handlers
  onSearchInput(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.searchQuery.set(val);
  }

  // Derived Filtered Team Signal
  filteredTeamMembers = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return this.teamMembers();
    return this.teamMembers().filter(m => 
      m.fullname?.toLowerCase().includes(q) || 
      m.email.toLowerCase().includes(q) || 
      m.roles.includes(q.toLowerCase())
    );
  });

  updateMemberRole(id: string, event: Event) {
    const newRole = (event.target as HTMLSelectElement).value as TeamMember['role'];
    this.teamMembers.update(members => 
      members.map(m => m._id === id ? { ...m, role: newRole } : m)
    );
    this.triggerToast('Member role permissions updated');
  }

  // Modal Control Methods
  openModal(type: 'addMember' | 'deleteAccount') {
    this.activeModal.set(type);
  }

  closeModal() {
    this.activeModal.set(null);
    this.deleteConfirmText.set('');
  }

  getRoleDescription(role: string): string {
    switch (role) {
      case 'Admin': return 'Full administrative control across security, billing, and team permissions.';
      case 'Manager': return 'Can manage projects, assign team roles, and invite new members.';
      case 'Editor': return 'Can read and edit workspace documents and projects.';
      case 'Billing': return 'Access limited to invoice downloads, payment setup, and subscription management.';
      default: return 'Read-only access across project dashboards and export tools.';
    }
  }

  submitAddMember() {
    this.closeModal();
    this.appService.createAdminAccount(JSON.parse(sessionStorage.getItem('user')!)._id).subscribe({
      next: (response: IResponse<any>) => {
        if(response.data) {
          this.teamMembers.update(currentTeammates => [
            ...currentTeammates ?? [],
            ...response.data ?? []
          ]);
          this.filteredTeamMembers();
        }
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      }
    })
    this.triggerToast(`Invitation sent to ${this.newMember()?.email}`);
  }

  removeTeamMember(id: string) {
    const target = this.teamMembers()?.find(m => m._id === id);
    this.teamMembers.update(members => members.filter(m => m._id !== id));
    if (target) {
      this.triggerToast(`Removed ${target.fullname} from team`);
    }
  }

  // Notification Toast Helper
  triggerToast(message: string) {
    const id = Date.now();
    this.toasts.update(t => [...t, { id, message, type: 'success' }]);
    setTimeout(() => {
      this.toasts.update(t => t.filter(item => item.id !== id));
    }, 3000);
  }
}
