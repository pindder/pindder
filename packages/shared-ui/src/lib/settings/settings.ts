import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
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
export class LibSettings implements OnInit{
    @Input() displayHeader = false;
    @Input() settingsItems!: SettingsSection[];
    @Input() accountType!: string;
    @Output() action = new EventEmitter<() => void>();

    ngOnInit(): void {
        return;
    }
}
