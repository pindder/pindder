import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators  } from '@angular/forms';

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
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './teams.html',
  styleUrl: './teams.css',
})
export class Teams implements OnInit{
  private fb = inject(FormBuilder);
  activeModal = signal<'addMember' | 'deleteAccount' | null>(null);
  searchQuery = signal<string>('');
  toasts = signal<ToastNotification[]>([]);
  deleteConfirmText = signal<string>('');
  
  // Reactive Forms
  profileForm: FormGroup;
  addMemberForm: FormGroup;
  securityForm: FormGroup;

  constructor() {
    this.profileForm = this.fb.group({
      fullName: ['Sarah Jenkins', Validators.required],
      email: ['sarah.jenkins@acme.io', [Validators.required, Validators.email]],
      jobTitle: ['Lead Product Designer'],
      phone: ['+1 (555) 234-5678'],
      bio: ['Product Lead with 8+ years experience crafting digital user experiences and interactive design systems.']
    });

    this.addMemberForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['Viewer', Validators.required],
      status: ['Active', Validators.required]
    });

    this.securityForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    return;
  }

  // Search & Team Table Handlers
  onSearchInput(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.searchQuery.set(val);
  }

  // Initial Team Directory State
  teamMembers = signal<TeamMember[]>([
    { id: 1, name: 'Sarah Jenkins', email: 'sarah.jenkins@acme.io', role: 'Admin', status: 'Active', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
    { id: 2, name: 'Marcus Chen', email: 'm.chen@acme.io', role: 'Manager', status: 'Active', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
    { id: 3, name: 'Elena Rostova', email: 'elena@acme.io', role: 'Editor', status: 'Active', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
    { id: 4, name: 'David Miller', email: 'd.miller@acme.io', role: 'Billing', status: 'Pending', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' }
  ]);

  // Derived Filtered Team Signal
  filteredTeamMembers = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return this.teamMembers();
    return this.teamMembers().filter(m => 
      m.name.toLowerCase().includes(q) || 
      m.email.toLowerCase().includes(q) || 
      m.role.toLowerCase().includes(q)
    );
  });

  updateMemberRole(id: number, event: Event) {
    const newRole = (event.target as HTMLSelectElement).value as TeamMember['role'];
    this.teamMembers.update(members => 
      members.map(m => m.id === id ? { ...m, role: newRole } : m)
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
    if (this.addMemberForm.valid) {
      const val = this.addMemberForm.value;
      const newMember: TeamMember = {
        id: Date.now(),
        name: val.name,
        email: val.email,
        role: val.role,
        status: val.status,
        avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150`
      };

      this.teamMembers.update(list => [...list, newMember]);
      this.closeModal();
      this.addMemberForm.reset({ role: 'Viewer', status: 'Active' });
      this.triggerToast(`Invitation sent to ${val.email}`);
    }
  }

  removeTeamMember(id: number) {
    const target = this.teamMembers().find(m => m.id === id);
    this.teamMembers.update(members => members.filter(m => m.id !== id));
    if (target) {
      this.triggerToast(`Removed ${target.name} from team`);
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
