import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonTextarea, IonButton, IonInput, 
  IonSelectOption, IonSelect, IonSpinner, 
  IonIcon, IonAlert, IonItem, IonLabel,
  ToastController,
  ModalController,
  IonNote,
} from "@ionic/angular";
import { DesignTypes, Gender, IColors, IDesign, IUser, Sizes } from '@pindder/contracts';
import { Camera } from '@capacitor/camera';
import { OverlayEventDetail } from '@ionic/core';
import { AppButton } from '../app-button/app-button';
import { TelInput } from '../tel-input/tel-input';

@Component({
  selector: 'lib-style-upload',
  imports: [
    IonLabel,
    IonItem,
    IonAlert,
    IonIcon,
    IonSpinner,
    IonTextarea,
    IonButton,
    IonContent,
    IonInput,
    FormsModule,
    IonSelect,
    IonSelectOption,
    IonNote,
    AppButton,
    TelInput
],
  templateUrl: './style-upload.html',
  styleUrl: './style-upload.css',
})
export class StyleUpload implements OnInit{
  @Output() submitStyle = new EventEmitter();
  @Output() uploadImages = new EventEmitter<Blob[]>();
  @Output() launchSpecification = new EventEmitter();
  
  @Input() design!: IDesign;  
  @Input() user!: IUser;
  @Input() colors!: IColors[];
  @Input() uploadedImageUrls: string[] = [];
  @Input() isUploading = false;

  private toastController = inject(ToastController);
  private modalCtrl = inject(ModalController);

  designType = DesignTypes;
  designTypes: string[] = [];
  sizes: string[] = [];
  selectedColors: IColors[] = [];

  genders = Object.keys(Gender);
  
  ngOnInit(): void {
    Object.keys(DesignTypes).forEach((v) => {
      this.designTypes.push(v);
    });

    Object.keys(Sizes).forEach((v) => {
      this.sizes.push(v);
    });
  }

  dismissModal(style?: IDesign) {
    if(style) {
      this.modalCtrl.dismiss(style, 'design');
    } else{
      this.modalCtrl.dismiss(null, 'cancel');
    }
  }

  setCountryCode($event: string) {
    this.user.countryCode = $event;
  }

  setTelephone($event: string) {
    this.user.tel = $event;
  }

  setResult(event: CustomEvent<OverlayEventDetail>) {
    console.log(`Dismissed with role: ${event.detail.role}`);
  }

  async presentToast(
    msg: string,
    color: 'danger' | 'light' | 'dark' | 'success' | 'primary' | 'secondary', 
    position: 'top' | 'middle' | 'bottom'
  ) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 5000,
      position: position,
      color: color,
      animated: true,
    });

    await toast.present();
  }

  async selectAndUploadMultipleImages() {
    // 1. Pick photos from gallery (Capacitor Camera allows multiple on web/mobile)
    const galleryPhotos = await Camera.pickImages({
      quality: 90,
      limit: 5, // Set max images user can pick at once
    });

    if (!galleryPhotos.photos.length) return;

    // 2. Convert each webPath to a Blob
    const blobPromises = galleryPhotos.photos.map(async (photo) => {
      const response = await fetch(photo.webPath);
      return await response.blob();
    });

    const blobs = await Promise.all(blobPromises);

    this.uploadImages.emit(blobs);
    // // 3. Upload all blobs concurrently to Cloudinary
    // await blobs.map((blob) =>
    //   { 
    //     console.log('Blob:::::', blob);
    //     this.uploadImages.emit(blob)
    //   }
    // );
  }

  async openSpecificationModal() {
    this.launchSpecification.emit()
  }

  removeImage(index: number) {
    this.uploadedImageUrls.splice(index, 1);
  }

  isColorSelected(code: string): boolean {
    return this.selectedColors.some((c) => c.code === code);
  }

  toggleColor(color: IColors): void {
    const index = this.selectedColors.findIndex((c) => c.name === color.name);
    if (index > -1) {
      this.selectedColors.splice(index, 1);
    } else {
      this.selectedColors.push(color);
    }
  }

  // Ensures checkmark icon is readable on light vs dark colors
  getContrastColor(hex: string): string {
    const cleanHex = hex.replace('#', '');
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 180 ? '#000000' : '#FFFFFF';
  }
}
