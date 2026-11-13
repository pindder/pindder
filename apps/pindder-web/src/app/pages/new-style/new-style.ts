import { ChangeDetectorRef, Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonButton, ViewWillEnter, IonIcon, ToastController, IonButtons, IonTitle, IonToolbar, IonHeader, ModalController } from "@ionic/angular";
import { countries, DesignTypes, IColors, IDesign, IResponse, IUser, Sizes } from '@pindder/contracts';
import { CloudinaryModule } from '@cloudinary/ng';
import { DesignService } from '../../services/design.service';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, forkJoin, of } from 'rxjs';
import { OverlayEventDetail } from '@ionic/core';
import { AppService } from '../../services/app.service';
import { StyleUpload } from '@pindder/shared-ui';
import { Clients } from '../clients/clients';
import { TokenService } from '../../services/token.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-new-style',
  imports: [
    IonIcon,
    IonButton,
    CloudinaryModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    StyleUpload,
],
  templateUrl: './new-style.html',
  styleUrl: './new-style.css',
})
export class NewStyle implements OnInit, ViewWillEnter{
  @Output() closeModal = new EventEmitter();

  private designService = inject(DesignService);
  private appService = inject(AppService);
  private tokenService = inject(TokenService);
  private authService = inject(AuthService);
  private toastController = inject(ToastController);
  private modalCtrl = inject(ModalController);
  private cdr = inject(ChangeDetectorRef);

  isAuthenticated!: boolean;
  designType = DesignTypes;
  design!: IDesign;
  newUser!: IUser;
  designTypes: string[] = [];
  sizes: string[] = [];
  selectedColors: IColors[] = [];
  availableColors: IColors[] = [];

  countries = countries;

  uploadedImageUrls: string[] = [];
  isUploading = false;

  ionViewWillEnter(): void { 
    this.fetchColors();
  }

  fetchColors() {
    this.appService.fetchColors().subscribe({
      next: (res: IResponse<IColors[]>) => {
        this.availableColors = res.data || [];
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
        this.presentToast(error.message, 'danger', 'top');
      }
    });
  }

  async ngOnInit() {
    Object.keys(DesignTypes).forEach((v) => {
      this.designTypes.push(v);
    });

    Object.keys(Sizes).forEach((v) => {
      this.sizes.push(v);
    });

    this.design = {
      name: "",
      description: "",
      amount: 0,
      category: "",
      type: "",
      specifications: [],
      images: [],
      colors: [],
      catalogDisplay: false 
    }

    this.isAuthenticated = await this.tokenService.isAuthenticated();
    console.log(this.isAuthenticated);

    if(!this.isAuthenticated){
      this.newUser = {
        fullname: '',
        email: '',
        countryCode: countries[38].code,
        tel: '',
        gender: ''
      };
    }
  }

  dismissModal(style?: IDesign) {
    if(style) {
      this.modalCtrl.dismiss(style, 'design');
    } else{
      this.modalCtrl.dismiss(null, 'cancel');
    }
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

  async selectAndUploadMultipleImages(event: Blob[]) {
    try {
      this.isUploading = true;
      this.cdr.markForCheck();

      const blobs = event;

      // 3. Upload all blobs concurrently to Cloudinary
      const uploadObservables = await blobs.map((blob: Blob) =>
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

  async openSpecificationModal() {
    const modal = await this.modalCtrl.create({
      component: Clients,
      componentProps: {
        specifications: this.design.specifications,
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    if(data) {
      this.design.specifications = data;
      this.cdr.markForCheck();
    }

    console.log(this.design);
  }

  removeImage(index: number) {
    this.uploadedImageUrls.splice(index, 1);
  }

  submit() {
    this.design.images = this.uploadedImageUrls;

    if(this.design.type === DesignTypes.BESPOKE) {
      this.design.colors = this.selectedColors;
      this.design.specifications = [];
    } else {
      this.design.colors = [];
    }

    console.log(this.design);
    console.log(this.newUser);

    // this.designService.createDesign(this.design).subscribe({
    //   next: (res: IResponse<IDesign>) => {
    //     this.presentToast(res.msg, 'primary', 'top'); 
    //     this.closeModal.emit(res.data);
    //     this.dismissModal(res.data);
    //   }, 
    //   error: (error: HttpErrorResponse) => {
    //     console.log(error);
    //     this.presentToast(error.message, 'danger', 'top');
    //   }
    // });

    forkJoin({
      user: this.authService.registerUser(this.newUser).pipe(
        catchError(error => {
          console.error('New User API failed:', error);
          return of(error.error); 
        })
      ),
      design: this.designService.createDesign(this.design).pipe(
        catchError(error => {
          console.error('New Design API failed:', error);
          return of(error.error);
        })
      )
    }).subscribe({
      next: (results) => {
        console.log('User:', results.user);
        console.log('Design:', results.design);
      },
      error: (err) => {
        // If ANY of the requests fail, the whole thing errors out
      }
    });
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
