import { ChangeDetectorRef, Component, inject, Input, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonItem, IonInput, IonButton, IonIcon, IonHeader, 
  IonTitle, IonToolbar, IonButtons, ModalController, ToastController, 
  IonModal, IonList, IonListHeader, IonNote, IonItemSliding, IonLabel, 
  IonItemOptions, IonItemOption, 
  ViewWillEnter
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { trashOutline, addOutline } from 'ionicons/icons';
import { ClientService } from '../../services/client.service';
import { HttpErrorResponse } from '@angular/common/http';
import { PrimaryButton } from '../primary-button/primary-button';
import { Gender, IMeasurement, IResponse } from '@pindder/contracts';
import { EmptyState } from '../empty-state/empty-state';

@Component({
  selector: 'app-measurement',
  imports: [
    IonItemOption, IonItemOptions, IonLabel,
    IonItemSliding, IonNote,
    IonListHeader, IonList, IonModal,
    CommonModule, ReactiveFormsModule,
    IonContent, IonItem, IonInput,
    IonButton, IonIcon, IonHeader,
    IonTitle, IonToolbar, IonButtons,
    PrimaryButton, IonModal,
    EmptyState
],
  templateUrl: './measurement.html',
  styleUrl: './measurement.css',
})
export class Measurement implements OnInit, ViewWillEnter{
  @Input() parent!: string; 
  @Input() client_id!: string;
  @Input() client_gender!: string;
  @Input() measurement_list!: IMeasurement[]; 

  @ViewChild('modal') modalSheet!: IonModal;

  private fb = inject(FormBuilder);
  private clientService = inject(ClientService);
  private cdr = inject(ChangeDetectorRef);
  private modalCtrl = inject(ModalController);
  private toastCtrl = inject(ToastController)

  measurementList: IMeasurement[] = [];
  measurement!: IMeasurement;
  editingMeasurement = false;

  form!: FormGroup;
  isLoading = signal<boolean>(true);
  name = signal<string>('');
  description = signal<string>('');

  constructor() {
    addIcons({ trashOutline, addOutline });
  }

  ionViewWillEnter(): void {
    if(this.parent){
      if(this.measurement_list.length > 0) this.measurementList = this.measurement_list;
      this.modalSheet.present();
    }
  }

  ngOnInit() {
    this.initForm();
    // Fetch existing client measurements from NestJS API
    if(!this.parent){
      this.loadClientMeasurements();
    }
  }

  initForm() {
    this.form = this.fb.group({
      name: [this.name(), [Validators.required]],
      description: [this.description()],
      owner: [this.client_id, !this.parent && Validators.required],
      measurements: this.fb.array([])
    });
  }

  openMeasurementModal() {
    this.name.set('');
    this.description.set('');
    this.initForm();
    this.modalSheet.present();
  }

  loadClientMeasurements() {
    this.isLoading.set(true);

    this.clientService.fetchClientMeasurements(this.client_id).subscribe({
      next: (res: IResponse<any>) => {
        // Clear any existing FormArray controls
        this.measurementList = res.data;
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

  editMeasurement(measure: IMeasurement) {
    this.editingMeasurement = true;
    this.measurement = measure;

    console.log(measure);
    this.name.set(measure.name);
    if(measure.description) this.description.set(measure.description);
    
    this.initForm();

    // Server returns measurements as a map/object: { Chest: "42 in", Waist: "32 in" }
    const dataMap = measure.measurements || {};
    const entries = Object.entries(dataMap);

    if (entries.length > 0) {
      // Pre-populate FormArray with server values
      entries.forEach(([key, value]) => {
        this.addMeasurement(key, String(value));
      });
    }

    this.cdr.markForCheck();

    this.modalSheet.present();
  }

  deleteMeasurement(index: number) {
    if(this.parent) {
      this.measurementList.splice(index, 1);
    } else {
      this.clientService.deleteClientMeasurement(this.measurementList[index]._id!).subscribe({
        next: (response: IResponse<any>) => {
          console.log(response.data);
        },
        error: (error: HttpErrorResponse) => {
          console.log(error);
        }
      });
    }
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
    console.log(this.measurements);
  }

  removeMeasurement(index: number) {
    this.measurements.removeAt(index);
  }

  dismissModal() {
    if(this.parent) {
      this.initForm();
      this.modalCtrl.dismiss(this.measurementList, 'cancel');
      console.log(this.measurementList);
    } else {
      this.modalCtrl.dismiss(null, 'cancel');
    }
  }

  createMeasurement(formattedPayload: any) {
    this.clientService.createMeasurement(formattedPayload).subscribe({
        next: (res: IResponse<any>) => {
          this.measurementList.push(res.data);
          this.presentToast(res.msg, 'primary', 'top');
          this.dismissModal();
          this.cdr.markForCheck();
        },
        error: (error: HttpErrorResponse) => {
          console.log(error);
          this.presentToast(error.error.msg, 'danger', 'top');
        }
      });
  }

  updateMeasurement(formattedPayload: any) {
    this.clientService.updateClientMeasurement(this.measurement._id!, formattedPayload).subscribe({
      next: (res: IResponse<any>) => {
        const measurementIndex = this.measurementList.indexOf(this.measurement);
        this.measurementList[measurementIndex] = res.data;

        this.presentToast(res.msg, 'primary', 'top');
        this.dismissModal();
      },
      error: (error: HttpErrorResponse) => {
        this.presentToast(error.message, 'danger', 'top');
      }
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.value;

    // Get the complete form object values
    const name = this.form.get('name')?.value;
    const description = this.form.get('description')?.value;

    // Convert array format [{key: 'Chest', value: '40'}] into a Map object { Chest: '40' }
    const formattedPayload = {
      name: name,
      description: description,
      owner: formValue.client ?? this.client_id,
      measurements: formValue.measurements.reduce((acc: Record<string, string>, item: { key: string; value: string }) => {
        if (item.key) acc[item.key] = item.value;
        return acc;
      }, {})
    };

    if(this.parent && !this.editingMeasurement) {
      this.measurementList.push(formattedPayload);
      this.dismissModal();
      return;
    } else if(this.parent && this.editingMeasurement){
      const measurementIndex = this.measurementList.indexOf(this.measurement);
      this.measurementList[measurementIndex] = formattedPayload;
      this.dismissModal();
      return;
    }
    console.log('Sending Payload:', formattedPayload);

    if(this.editingMeasurement) {
      this.updateMeasurement(formattedPayload);
    } else { 
      this.createMeasurement(formattedPayload);
    }
  }
}
