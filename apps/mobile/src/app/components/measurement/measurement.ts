import { ChangeDetectorRef, Component, inject, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { 
  IonContent, IonItem, IonInput, IonButton, IonIcon
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { trashOutline, addOutline } from 'ionicons/icons';
import { ClientService } from '../../services/client.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-measurement',
  imports: [
    CommonModule, ReactiveFormsModule, 
    IonContent, IonItem, IonInput, 
    IonButton, IonIcon,
  ],
  templateUrl: './measurement.html',
  styleUrl: './measurement.css',
})
export class Measurement implements OnInit{
  @Input() client_id!: string;

  private fb = inject(FormBuilder);
  private clientService = inject(ClientService);
  private cdr = inject(ChangeDetectorRef);

  form!: FormGroup;
  isLoading = signal<boolean>(true);

  constructor() {
    addIcons({ trashOutline, addOutline });
  }

  ngOnInit() {
    this.form = this.fb.group({
      client: [this.client_id, Validators.required],
      measurements: this.fb.array([])
    });

    // Fetch existing client measurements from NestJS API
    this.loadClientMeasurements();
  }

  loadClientMeasurements() {
    this.isLoading.set(true);

    this.clientService.fetchClientMeasurements(this.client_id).subscribe({
      next: (res) => {
        // Clear any existing FormArray controls
        this.measurements.clear();

        // Server returns measurements as a map/object: { Chest: "42 in", Waist: "32 in" }
        const dataMap = res.measurements || {};
        const entries = Object.entries(dataMap);

        console.log(entries);
        if (entries.length > 0) {
          // Pre-populate FormArray with server values
          entries.forEach(([key, value]) => {
            this.addMeasurement(key, String(value));
          });
        } else {
          // Populate with common default fields
          this.addMeasurement('Chest', '');
          this.addMeasurement('Waist', '');
          this.addMeasurement('Hips', '');
        }

        this.cdr.markForCheck();
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load client measurements:', err);
        // Fallback default row
        this.addMeasurement('', '');
        this.isLoading.set(false);
      }
    });
  }

  get measurements(): FormArray {
    return this.form.get('measurements') as FormArray;
  }

  createMeasurementGroup(key = '', value = ''): FormGroup {
    return this.fb.group({
      key: [key, Validators.required],
      value: [value, Validators.required]
    });
  }

  addMeasurement(key = '', value = '') {
    this.measurements.push(this.createMeasurementGroup(key, value));
  }

  removeMeasurement(index: number) {
    this.measurements.removeAt(index);
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.value;
    console.log(formValue);

    // Convert array format [{key: 'Chest', value: '40'}] into a Map object { Chest: '40' }
    const formattedPayload = {
      client: formValue.client,
      measurements: formValue.measurements.reduce((acc: Record<string, string>, item: { key: string; value: string }) => {
        if (item.key) acc[item.key] = item.value;
        return acc;
      }, {})
    };

    console.log('Sending Payload:', formattedPayload);

    this.clientService.createMeasurement(formattedPayload).subscribe({
      next: (res) => {
        console.log('Saved successfully:', res)
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      }
    });
  }
}
