import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, 
  IonContent, IonButton, IonIcon, IonAlert, ViewWillEnter, IonInput, 
  IonTextarea, IonSelect, IonList, IonSelectOption, IonItem, 
  IonActionSheet
} from '@ionic/angular';
import { DesignService } from '../../services/design.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { DesignTypes, IDesign, Sizes } from '@pindder/contracts';
import { forkJoin } from 'rxjs';
import { Camera } from '@capacitor/camera';
import { FormsModule } from '@angular/forms';
import { AppService } from '../../services/app.service';

@Component({
  imports: [IonActionSheet, IonList, IonTextarea, IonInput, IonAlert, IonIcon, IonButton,
    IonHeader, IonToolbar, IonButtons, IonBackButton,
    IonTitle, IonContent, IonSelect, IonSelectOption, FormsModule, IonItem, 
    IonTitle, IonContent, IonSelect, IonSelectOption, FormsModule
  ],
  templateUrl: './design-view.html',
  styleUrl: './design-view.css',
})
export class DesignView implements ViewWillEnter, OnInit{
  private designService = inject(DesignService);
  private ar = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);
  private appService = inject(AppService);
  private router = inject(Router);

  style_id = signal<string>("");
  design!: IDesign;
  uploadedImageUrls: string[] = [];
  selectedSizes: string[] = [];
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
      role: 'destructive',
      handler: () => {
    
      },
    },
  ];

  designTypes = Object.keys(DesignTypes);
  sizes = Object.keys(Sizes);

  ionViewWillEnter(): void {
    const style_id = this.ar.snapshot.paramMap.get('id');

    if(style_id) {
      this.style_id.set(style_id);
    }

    this.fetchDesign();
  }

  ngOnInit(): void {
    
  }

  async openImage(imageUrl: string) {
    this.appService.openSingle(imageUrl);
  }

  onSizesChange(size: any) {
    this.selectedSizes = size.detail.value;
    console.log(this.selectedSizes);
  }

  fetchDesign() {
    this.designService.fetchDesign(this.style_id()).subscribe({
      next: (res) => {
        this.design = res.data;
        console.log(this.design);
        this.selectedSizes = res.data.sizes;
        console.log(this.selectedSizes);
        this.uploadedImageUrls = res.data.images;
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

  submit() {}

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
