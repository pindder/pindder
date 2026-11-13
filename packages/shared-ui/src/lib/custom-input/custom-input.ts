import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonInput, IonItem, IonIcon } from "@ionic/angular";

@Component({
    selector: 'lib-custom-input',
    imports: [
        IonIcon,
        IonInput,
        FormsModule,
        IonItem,
        CommonModule
    ],
    templateUrl: './custom-input.html',
    styleUrl: './custom-input.css',
})
export class CustomInput implements OnInit{
    @Input() icon?: boolean;
    @Input() inputValue!: string;
    @Input() inputName!: string;
    @Input() inputType = 'text';
    @Input() inputLabel = ''
    @Input() inputPlaceholder = '';

    ngOnInit(): void {
        if(this.icon) {
        this.icon = true;
        } else { this.icon = false }
    }
}