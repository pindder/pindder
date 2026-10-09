import { ChangeDetectorRef, Component, inject, Input, OnInit, signal } from '@angular/core';
import { IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonButton, IonIcon, IonAlert, ViewWillEnter, IonInput, IonTextarea, IonSelect, IonList, IonSelectOption, IonItem, IonActionSheet, IonToggle, ModalController, ToastController, IonLabel, IonListHeader } from '@ionic/angular';
import { DesignService } from '../../services/design.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTypes, DesignTypes, GalleryItem, IColors, IDesign, IResponse, Sizes } from '@pindder/contracts';
import { forkJoin } from 'rxjs';
import { Camera } from '@capacitor/camera';
import { FormsModule } from '@angular/forms';
import { AppService } from '../../services/app.service';
import { PrimaryButton } from '../../components/primary-button/primary-button';
import { Specification } from '../../components/specification/specification';

@Component({
  imports: [IonToggle, IonActionSheet, IonList, IonTextarea, IonInput, IonAlert, IonIcon, IonButton,
    IonHeader, IonToolbar, IonButtons, IonBackButton,
    IonTitle, IonContent, IonSelect, IonSelectOption, FormsModule, IonItem,
    IonTitle, IonContent, IonSelect, IonSelectOption, FormsModule, PrimaryButton, IonLabel, IonListHeader],
  templateUrl: './design-view.html',
  styleUrl: './design-view.css',
})
export class DesignView implements ViewWillEnter, OnInit{
  @Input() design!: IDesign;
  @Input() dataType!: string;

  private designService = inject(DesignService);
  private ar = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);
  private appService = inject(AppService);
  private router = inject(Router);
  private modalCtrl = inject(ModalController);
  private toastController = inject(ToastController);

  style_id = signal<string>("");
  designType = DesignTypes;
  uploadedImageUrls: string[] = [];
  selectedColors: IColors[] = [];
  availableColors: IColors[] = [];
  isUploading: boolean = false;
  isActionSheetOpen = signal<boolean>(false);
  modalContent = signal<string>("");
  actionSheetButtons = [
    {
      text: 'Upload Images',
      icon: 'cloud-upload-outline',
      disabled:  this.uploadedImageUrls.length === 4,
      handler: () => {
        this.selectAndUploadMultipleImages();
      },
    },
    {
      text: 'New Order',
      icon: 'bag-add-outline',
      handler: () => {
        this.router.navigate(['app/orders'], {
          queryParams: {
            style: this.style_id()
          }
        })
      },
    },
    {
      text: 'Remove Style',
      icon: 'trash-outline',
      // role: 'destructive',
      handler: () => {
    
      },
    },
  ];

  dataTypes = Object.keys(DataTypes);
  designTypes = Object.keys(DesignTypes);
  sizes = Object.keys(Sizes);

  ionViewWillEnter(): void {
    this.fetchColors();
    const style_id = this.ar.snapshot.paramMap.get('id');

    if(style_id) {
      this.style_id.set(style_id);
    } else {
      this.design._id = this.ar.snapshot.queryParamMap.get('style') || '';
    }

    // if design is passed as prop to component don't call api
    if(this.design) {
      //console.log(this.design);
      this.uploadedImageUrls = this.design.images;
      this.cdr.markForCheck();
    } else {
      this.fetchDesign(); // call design from api when not passed as prop
    }
  }

  ngOnInit(): void {
    
  }

  async openSpecificationModal() {
    const modal = await this.modalCtrl.create({
      component: Specification,
      componentProps: {
        specifications: this.design.specifications,
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    if(data) {
      this.design.specifications = data;
    }
  }

  fetchColors() {
    this.appService.fetchColors().subscribe({
      next: (res: IResponse<IColors[]>) => {
        this.availableColors = res.data || [];
        console.log(this.availableColors);
        this.cdr.markForCheck();
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
        this.presentToast(error.message, 'danger', 'top');
      }
    });
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

  async openImage() {
    //this.appService.openSingle(imageUrl);
    
    let images: GalleryItem[] =  [];
    
    this.design.images.map((image) => {
      let imgObj = {
        src: image,
        w: 1200,
        h: 1400
      }
      images.push(imgObj);
    })
    this.appService.open(images);
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

  fetchDesign() {
    this.designService.fetchDesign(this.style_id()).subscribe({
      next: (res) => {
        this.design = res.data;
        
        this.selectedColors = res.data.colors;
        this.uploadedImageUrls = res.data.images;
        console.log(this.selectedColors);
        this.cdr.markForCheck();
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      }
    })
  }

  async openActionSheet() {
    this.isActionSheetOpen.set(true);
  }

  dismissModal() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  submit() {
    this.design.colors = [];

    this.selectedColors.forEach((color: IColors) => {
      const colour = this.availableColors.find(c => c._id === color._id);
      if(color) {
        this.design.colors.push(colour);
      }
    });

    this.design.images = this.uploadedImageUrls;

    this.designService.updateDesign(this.design._id!, this.design).subscribe({
      next: (res: IResponse<any>) => {
        this.design = res.data;
        this.presentToast(res.msg, 'primary', 'top');
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
        this.presentToast(error.error.msg, 'danger', 'bottom');
      }
    });
  }

  async selectAndUploadMultipleImages() {
    try {
      // 1. Pick photos from gallery (Capacitor Camera allows multiple on web/mobile)
      const galleryPhotos = await Camera.pickImages({
        quality: 90,
        limit: (5 - this.uploadedImageUrls.length), // Set max images user can pick at once
      });

      if (!galleryPhotos.photos.length) return;

      this.isUploading = true;

      // 2. Convert each webPath to a Blob
      const blobPromises = galleryPhotos.photos.map(async (photo) => {
        const response = await fetch(photo.webPath);
        return await response.blob();
      });

      const blobs = await Promise.all(blobPromises);

      // 3. Upload all blobs concurrently to Cloudinary
      const uploadObservables = blobs.map((blob: any) =>
        this.designService.uploadImageToCloudinary(blob)
      );

      forkJoin(uploadObservables).subscribe({
        next: (responses: any[]) => {
          const newUrls = responses.map((res) => res.secure_url);
          this.uploadedImageUrls = [...this.uploadedImageUrls, ...newUrls];
          this.isUploading = false;
          //console.log(this.uploadedImageUrls);
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Cloudinary multi-upload failed:', err);
          this.isUploading = false;
        },
      });
    } catch (error) {
      console.error('Photo selection cancelled or error:', error);
      this.isUploading = false;
    }
  }

  removeImage(index: number) {
    this.uploadedImageUrls.splice(index, 1);
  }
}
