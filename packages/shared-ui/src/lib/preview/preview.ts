import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { IonButton, IonList, IonItem, IonIcon, IonItemSliding, IonAvatar, IonLabel, 
  IonItemOptions, ViewWillEnter, IonHeader, IonButtons, IonListHeader, IonTitle, 
  IonToolbar, IonContent, IonItemOption, ModalController, IonBackButton, IonNote, 
  ToastController, IonModal, IonItemGroup, IonItemDivider, AlertController, IonSelect, 
  IonSelectOption 
} from "@ionic/angular";
import { DataTypes, DesignTypes, IDesign, IOrderItem, IOrderStyle, IPayment, OrderStatus, PaymentMethods } from '@pindder/contracts';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Share } from '@capacitor/share';
import { AppButton } from '../app-button/app-button';

@Component({
  selector: 'lib-preview',
  imports: [
    IonHeader, IonItemOptions, IonLabel, IonAvatar, IonItemSliding,
    IonIcon, IonItem, IonList, IonButton, IonButtons, IonListHeader,
    IonTitle, IonToolbar, IonContent, IonItemOption, IonBackButton,
    IonToolbar, IonContent, IonItemOption, IonBackButton, DatePipe,
    IonNote, IonModal, IonNote,
    IonItemGroup, TitleCasePipe, FormsModule,
    IonItemDivider, IonSelect, IonSelectOption,
    AppButton
],
  templateUrl: './preview.html',
  styleUrl: './preview.css',
})
export class Preview implements ViewWillEnter, OnInit{
    @Input() client_id!: string;
    @Input() order!: IOrderItem | any;
    @Input() isPreview = false;
    
    @Output() cancelOrder = new EventEmitter();
    @Output() launchMeasurementModal = new EventEmitter();
    @Output() makePayment = new EventEmitter();
    @Output() action = new EventEmitter();

    private modalCtrl = inject(ModalController);
    private toastCtrl = inject(ToastController);
    private alertCtrl = inject(AlertController);

    //order!: IOrderItem | any;
    
    orderStatuses = OrderStatus;
    orderStatus = Object.keys(OrderStatus);
    isModalOpen = false;

    payment!: IPayment[];
    selectedStyleIndex!: number;
    selectedStyle!: IOrderStyle;

    designTypes = DesignTypes;
    paymentMethod = PaymentMethods;

    isSharingSupported = signal<boolean>(false);

    ionViewWillEnter(): void {
        return;
    }

    async ngOnInit() {
        try {
        // Check if the current platform/browser supports sharing
        const result = await Share.canShare();
        this.isSharingSupported.set(result.value);
        } catch (error) {
        console.error('Error checking share capability:', error);
        this.isSharingSupported.set(false);
        }
    }

    async sharePaymentLink(payment_link?: string) {
        if (!this.isSharingSupported()) return;

        try {
        await Share.share({
            title: 'Pindder: Order Payment!',
            text: 'Hey, kindly complete your payment through the link.',
            url: `${payment_link ?? this.payment[0].responsePayload.authorization_url}`, // The link you want to share
            dialogTitle: 'Pindder payment', // Android only title for the popup
        });
        } catch (error) {
        console.error('Error sharing:', error);
        }
    }

    dismissModal() {
        this.modalCtrl.dismiss(null, 'cancel');
    }

    viewDesignDetails(design?: IDesign) {
        return;
    }

    async copyPaymentLinkToClipboard(): Promise<void> {
        try {
        await navigator.clipboard.writeText(this.payment[0].responsePayload.authorization_url);
        await this.showToast('Payment link copied to clipboard!');
        } catch (err) {
        await this.showToast('Failed to copy link. Please copy manually.');
        console.log(err);
        }
    }

    private async showToast(message: string): Promise<void> {
        const toast = await this.toastCtrl.create({
        message,
        duration: 2000,
        position: 'bottom',
        color: 'dark'
        });
        await toast.present();
    }

    async presentDeleteAlert() {
        const alert = await this.alertCtrl.create({
        header: `Delete Order`,
        message: `Are you sure you want to delete this ${DataTypes.ORDER}?`,
        buttons: [
            {
            text: 'Cancel',
            role: 'cancel'
            },
            {
            text: 'Delete',
            role: 'confirm',
            handler: () => {
                this.cancelOrder.emit();
            }
            }
        ]
        });

        await alert.present();
    }

    cancel() {
        this.presentDeleteAlert();
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

    async openMeasurementModal() {
        this.launchMeasurementModal.emit()
    }

    async viewStyleDetail(style: IOrderStyle) {
        this.selectedStyle = style;
        //console.log(this.selectedStyle);
        this.isModalOpen = true;
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

    updateOrderStatus() {
        return;
    }

    repeatOrder() {
        return;
    }
}
