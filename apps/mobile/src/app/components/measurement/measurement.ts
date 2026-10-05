import { ChangeDetectorRef, Component, inject, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonItem, IonInput, IonButton, IonIcon, IonHeader, 
  IonTitle, IonToolbar, IonButtons, ModalController, ToastController 
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { trashOutline, addOutline } from 'ionicons/icons';
import { ClientService } from '../../services/client.service';
import { HttpErrorResponse } from '@angular/common/http';
import { PrimaryButton } from '../primary-button/primary-button';
import { Gender, IMeasurement, IResponse } from '@pindder/contracts';

@Component({
  selector: 'app-measurement',
  imports: [
    CommonModule, ReactiveFormsModule,
    IonContent, IonItem, IonInput,
    IonButton, IonIcon, IonHeader,
    IonTitle, IonToolbar, IonButtons,
    PrimaryButton
],
  templateUrl: './measurement.html',
  styleUrl: './measurement.css',
})
export class Measurement implements OnInit{
  @Input() client_id!: string;
  @Input() client_gender!: string;

  private fb = inject(FormBuilder);
  private clientService = inject(ClientService);
  private cdr = inject(ChangeDetectorRef);
  private modalCtrl = inject(ModalController);
  private toastCtrl = inject(ToastController)

  measurement!: IMeasurement;

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
      next: (res: IResponse<any>) => {
        // Clear any existing FormArray controls
        this.measurement = res.data;
        this.measurements.clear();

        // Server returns measurements as a map/object: { Chest: "42 in", Waist: "32 in" }
        const dataMap = res.data.measurements || {};
        const entries = Object.entries(dataMap);

        // console.log(entries);
        if (entries.length > 0) {
          // Pre-populate FormArray with server values
          entries.forEach(([key, value]) => {
            this.addMeasurement(key, String(value));
          });
        }

        this.cdr.markForCheck();
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load client measurements:', err);
        // Populate with common default fields
        this.addMeasurement(this.client_gender === Gender.FEMALE ? 'Bust' : 'Chest', '');
        this.addMeasurement('Waist', '');
      
        this.isLoading.set(false);
      }
    });
  }

  get measurements(): FormArray {
    return this.form.get('measurements') as FormArray;
  }

  async presentToast(
    msg: string,
    color: 'danger' | 'light' | 'dark' | 'success' | 'primary' | 'secondary', 
    position: 'top' | 'middle' | 'bottom'
  ) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 5000,
      position: position,
      color: color,
      animated: true,
    });

    await toast.present();
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

  dismissModal() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.value;

    // Convert array format [{key: 'Chest', value: '40'}] into a Map object { Chest: '40' }
    const formattedPayload = {
      client: formValue.client,
      measurements: formValue.measurements.reduce((acc: Record<string, string>, item: { key: string; value: string }) => {
        if (item.key) acc[item.key] = item.value;
        return acc;
      }, {})
    };

    // console.log('Sending Payload:', formattedPayload);

    if(this.measurement) {
      this.clientService.updateClientMeasurement(this.measurement._id!, formattedPayload).subscribe({
        next: (res: IResponse<any>) => {
          this.presentToast(res.msg, 'primary', 'top');
          this.dismissModal();
        },
        error: (error: HttpErrorResponse) => {
          this.presentToast(error.message, 'danger', 'top');
        }
      })
    } else { 
      this.clientService.createMeasurement(formattedPayload).subscribe({
        next: (res: IResponse<any>) => {
          console.log('Saved successfully:', res)
          this.presentToast(res.msg, 'primary', 'top');
          this.dismissModal();
        },
        error: (error: HttpErrorResponse) => {
          console.log(error);
        }
      });
    }
  }
}
