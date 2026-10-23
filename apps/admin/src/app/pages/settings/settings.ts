import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Teams } from '../teams/teams';

interface ToastNotification {
  id: number;
  message: string;
  type: 'success' | 'info' | 'warning' | 'danger';
}

@Component({
  selector: 'app-settings',
  imports: [ReactiveFormsModule, CommonModule, Teams],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings implements OnInit{
  private fb = inject(FormBuilder);
  
  ngOnInit(): void {
    return;
  }

  // Navigation Tabs Configuration
  tabs = [
    { id: 'profile', label: 'Profile Edit', icon: 'fa-regular fa-user' },
    { id: 'appearance', label: 'Color & Appearance', icon: 'fa-solid fa-palette' },
    { id: 'team', label: 'Team Management', icon: 'fa-solid fa-users' },
    { id: 'security', label: 'Account & Security', icon: 'fa-solid fa-shield-halved' }
  ];

  // Primary State Signals
  activeTab = signal<string>('profile');
  primaryColor = signal<string>('#F1641D'); // Requested Default Accent Color
  bgVariant = signal<'slate' | 'warm' | 'white'>('slate');
  density = signal<'comfortable' | 'compact'>('comfortable');
  searchQuery = signal<string>('');
  twoFactorEnabled = signal<boolean>(true);
  
  // Modals & Toasts State
  activeModal = signal<'addMember' | 'deleteAccount' | null>(null);
  deleteConfirmText = signal<string>('');
  toasts = signal<ToastNotification[]>([]);

  // Profile Avatar State
  profileAvatar = signal<string>('https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80');

  // Preset Theme Colors
  presetColors = [
    { name: 'Warm Orange', hex: '#F1641D' },
    { name: 'Coral Red', hex: '#E11D48' },
    { name: 'Amber Gold', hex: '#D97706' },
    { name: 'Emerald', hex: '#059669' },
    { name: 'Royal Indigo', hex: '#4F46E5' }
  ];

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

  // Color & Appearance Methods
  setPrimaryColor(hex: string) {
    this.primaryColor.set(hex);
    this.triggerToast(`Theme accent updated to ${hex}`);
  }

  onCustomColorPick(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.setPrimaryColor(val);
  }

  toggleDensity() {
    const newDensity = this.density() === 'comfortable' ? 'compact' : 'comfortable';
    this.density.set(newDensity);
    this.triggerToast(`Layout density set to ${newDensity}`);
  }

  // Avatar Handlers
  onAvatarSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          this.profileAvatar.set(e.target.result as string);
          this.triggerToast('Profile photo updated successfully');
        }
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  resetAvatar() {
    this.profileAvatar.set('https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80');
    this.triggerToast('Avatar restored to default');
  }

  saveProfile() {
    if (this.profileForm.valid) {
      this.triggerToast('Profile settings saved successfully');
    }
  }

  // Search & Team Table Handlers
  onSearchInput(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.searchQuery.set(val);
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

  // Delete Account Confirmation Logic
  onDeleteInput(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.deleteConfirmText.set(val);
  }

  executeDeleteAccount() {
    this.closeModal();
    this.triggerToast('Account deletion request queued');
  }

  updatePassword() {
    if (this.securityForm.valid) {
      this.triggerToast('Password updated securely');
      this.securityForm.reset();
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
