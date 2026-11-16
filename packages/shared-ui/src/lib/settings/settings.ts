import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonHeader, IonIcon, IonItem, IonLabel, IonList, 
    IonTitle, IonToolbar
} from '@ionic/angular';
import { SettingsSection } from '@pindder/contracts';

@Component({
  selector: 'lib-settings',
  imports: [
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonIcon,
    IonItem,
    IonList,
    IonLabel,
    RouterLink,
],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class LibSettings {
    @Input() displayHeader = false;
    @Input() settingsItems!: SettingsSection[];
    @Output() action = new EventEmitter<() => void>();
    @Output() logout = new EventEmitter();
    @Output() deleteAccount = new EventEmitter();

    private router = inject(Router);

    openProfileEdit() {
        this.router.navigate(['app/profile/edit']);
    }
}
