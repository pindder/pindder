import { ChangeDetectorRef, Component, EventEmitter, inject, Input, OnDestroy, Output, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonButton, IonContent, IonItem, IonList, ViewWillEnter, IonLabel, 
  ToastController, IonHeader, IonToolbar, IonTitle, IonButtons, IonIcon, 
  IonListHeader, ModalController, IonDatetime, IonActionSheet, IonItemOption, 
  IonAvatar, IonItemOptions, IonItemSliding, IonTextarea, IonNote, IonModal, 
  IonSelect, IonSelectOption, IonItemGroup, IonItemDivider } from "@ionic/angular";
import { DeliveryMethods, DesignTypes, IClient, IColors, IDesign, IOrder, IOrderItem, IOrderStyle, ISpecification, PaymentMethods } from '@pindder/contracts';  
import { ActivatedRoute, Router } from '@angular/router';
import { EmptyState } from '../empty-state/empty-state';
import { AppButton } from '../app-button/app-button';
import { Preview } from '../preview/preview';

@Component({
  selector: 'lib-create-order',
  imports: [IonItemDivider,
    IonModal,
    IonNote, IonTextarea,
    IonItemOptions,
    IonAvatar,
    IonItemOption,
    IonActionSheet,
    IonDatetime,
    IonLabel,
    IonContent,
    IonList,
    IonItem,
    IonButton,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonIcon,
    IonTitle,
    IonListHeader,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonIcon,
    FormsModule,
    IonItemSliding,
    EmptyState,
    IonNote,
    IonSelect,
    IonSelectOption,
    IonItemGroup,
    IonItemDivider, AppButton, Preview],
  templateUrl: './create-order.html',
  styleUrl: './create-order.css',
})
export class CreateOrder implements ViewWillEnter, OnDestroy{
    @Input() order!: IOrder;
    @Input() client?: IClient;
    @Input() design?: IDesign;
    @Input() existingOrder!: IOrder;

    @Output() buildOrder = new EventEmitter<IOrder>();
    @Output() submitOrder = new EventEmitter<IOrder>();
    @Output() launchNewClientModal = new EventEmitter();
    @Output() launchNewDesignModal = new EventEmitter();
    @Output() launchExistingClientModal = new EventEmitter();
    @Output() launchExistingDesignModal = new EventEmitter();
    @Output() launchMeasurementModal = new EventEmitter();
    @Output() launchDesignDetailModal = new EventEmitter();
    @ViewChild('modal') modalSheet!: IonModal;

    private cdr = inject(ChangeDetectorRef);
    private toastCtrl = inject(ToastController);
    private modalCtrl = inject(ModalController);
    private router = inject(Router);
    private ar = inject(ActivatedRoute);
    
    presentingElement!: HTMLElement | null;
    selectedClient!: IClient | null;
    selectedStyleIndex!: number;
    selectedStyle!: IOrderStyle;

    
    clients: IClient[] = [];
    designs: IDesign[] = [];
    completeOrder!: IOrderItem;

    isClientActionSheetOpen = signal<boolean>(false);
    isDesignActionSheetOpen = signal<boolean>(false);

    /** Client Action Sheet Buttons */
    clientActionSheetButtons = [
        {
        text: 'New Client',
        icon: 'add-outline',
        handler: () => {
            this.openNewClientModal();
        },
        },
        {
        text: 'Existing Client',
        icon: 'search-outline',
        handler: () => {
            this.openSelectClientModal();
        },
        },
    ];

    /** Design Action Sheet Buttons */
    designActionSheetButtons = [
        {
        text: 'New Style',
        icon: 'add-outline',
        handler: () => {
            this.openNewDesignModal();
        },
        },
        {
        text: 'Existing Style',
        icon: 'search-outline',
        handler: () => {
            this.openSelectDesignModal();
        },
        },
    ];

    deliveryMethods = Object.keys(DeliveryMethods);
    deliveryMethod = DeliveryMethods;
    designTypes = DesignTypes;
    paymentMethods = Object.keys(PaymentMethods);
    paymentMethod = PaymentMethods;

    isPreview = false;

    ionViewWillEnter(): void {
        // console.log(this.client);
        // console.log(this.design);
        if(this.client) {
        this.selectedClient = this.client;
        } else if(this.design) {
        // let selections: any[] = [];

        // this.design.specifications.forEach((spec: ISpecification) => {
        //   selections.push({...spec, colors: [], quantity: 0 });
        // });

        this.order.styles.push({
            amount: this.design.amount ?? null,
            description: this.design.description ?? null,
            dueDate: '',
            images: this.design.images,
            type: this.design.type,
            name:  this.design.name,
            specifications: this.design.specifications,
            selections: [],
            colors: this.design.colors ?? [],
            selectedColors: [],
            catalogDisplay: false,
            //design: data,
            totalAmount: 0,
            totalItems: 0,
            quantity: 0
        });
        }
        
        if(this.existingOrder) {
        console.log(this.existingOrder);
        this.order = this.existingOrder;
        }
        console.log(this.client);
        console.log(this.order);

        if(this.order.styles.length > 0) {
        this.order.styles.forEach((style: IOrderStyle) => {
            style.selections.forEach((selection: ISpecification) => {
            if(selection.quantity > 0) {
                this.order.totalAmount = this.order.totalAmount + selection.amount;
            } else {
                this.order.totalAmount = 0;
            }
            });
        });
        }
        this.cdr.markForCheck();
    }

    async openNewClientModal() {
        this.launchNewClientModal.emit()
    }

    async openClientActionSheet() {
        this.isClientActionSheetOpen.set(true);
    }

    async openDesignActionSheet() {
        this.isDesignActionSheetOpen.set(true);
    }

    async openSelectClientModal() {
        this.launchExistingClientModal.emit();
    }

    async openNewDesignModal() { 
        this.launchNewDesignModal.emit();
    }

    async openSelectDesignModal() { 
        this.launchExistingDesignModal.emit()
    }

    async viewDesignDetails(design: IOrderStyle) {
        this.launchDesignDetailModal.emit();
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

    onDateChange(event: CustomEvent) {
        console.log(event.detail.value);
    }

    dismissModal() {
        this.modalCtrl.dismiss(null, 'cancel');
        // this.ngOnDestroy();

        let paramKey!: string;
        
        if(this.client) {
        paramKey = 'client'
        } else if(this.design) {
        paramKey = 'style'
        } else {
        paramKey = 'order'
        }

        this.selectedClient = null;

        this.router.navigate([], {
        relativeTo: this.ar,
        queryParams: {
            [paramKey]: null // Setting to null or undefined removes it from the URL
        },
        queryParamsHandling: 'merge' // Merges with current params so other params remain
        });
    }

    removeSelectedClient() {
        this.selectedClient = null;
    }

    removeSelectedDesign(index: number) {
        this.order.styles.splice(index, 1);
        this.cdr.markForCheck();
    }

    decrementQuantity(specification: ISpecification) {
        const index = this.selectedStyle.specifications.indexOf(specification);

        if(this.selectedStyle.selections && this.selectedStyle.selections.length > 0) {
            const selection = this.selectedStyle.selections.find((selection) => selection.size === this.selectedStyle.specifications[index].size);
            if(selection && selection.quantity > 0) {
                selection.inStock! += 1;
                selection.quantity -= 1;
                this.selectedStyle.selections[index] = selection;
                this.selectedStyle.totalAmount -= selection.amount; 
                this.order.totalAmount -= selection.amount;
            }
        }
        
        this.cdr.markForCheck();
    }

    incrementQuantityBespoke() {
        if(this.selectedStyle.amount === null) {
            return;
        }

        this.selectedStyle.quantity++;
        this.order.totalAmount += this.selectedStyle.amount;
    }

    decrementQuantityBespoke() {
        if(this.selectedStyle.amount === null) {
            return;
        }

        if(this.selectedStyle.quantity > 0) {
            this.selectedStyle.quantity--;
            this.order.totalAmount -= this.selectedStyle.amount;
        }
    }

    incrementQuantity(specification: ISpecification) {
        const specIndex = this.selectedStyle.specifications.indexOf(specification);
        if(this.selectedStyle.selections.length > 0) {
            const selection = this.selectedStyle.selections.find((selection) => selection.size === this.selectedStyle.specifications[specIndex].size);
            
            if(selection) {
                selection.inStock! -= 1;
                selection.quantity += 1;
                this.selectedStyle.selections[specIndex] = selection;
                this.selectedStyle.totalAmount += selection.amount;
                this.order.totalAmount += selection.amount;
            } else {
                this.selectedStyle.selections.push({ 
                ...this.selectedStyle.specifications[specIndex], 
                inStock: this.selectedStyle.specifications[specIndex].quantity - 1, 
                quantity: 1 
                });
            }
        } else {
            this.selectedStyle.selections.push({ 
                ...this.selectedStyle.specifications[specIndex], 
                inStock: this.selectedStyle.specifications[specIndex].quantity - 1, 
                quantity: 1 
            });
        }
        
        this.cdr.markForCheck();
    }

    async openMeasurementModal() {
        this.launchMeasurementModal.emit();
    }

    ngOnDestroy(): void {
        console.log('new-order component destroyed')
        let paramKey!: string;
        
        if(this.client) {
        paramKey = 'client'
        } else if(this.design) {
        paramKey = 'style'
        } else {
        paramKey = 'order'
        }

        this.selectedClient = null;

        this.router.navigate([], {
        relativeTo: this.ar,
        queryParams: {
            [paramKey]: null // Setting to null or undefined removes it from the URL
        },
        queryParamsHandling: 'merge' // Merges with current params so other params remain
        });

        this.cdr.markForCheck();
    }

    openModalSheet(index: number, style: IOrderStyle) {
        this.selectedStyle = style;
        this.selectedStyleIndex = index;

        if(this.selectedStyle.selections.length == 0) {
        const selections: ISpecification[] = [];

        this.selectedStyle.specifications.forEach((spec: ISpecification) => {
            selections.push({...spec, colors: [], quantity: 0 });
        });
        this.selectedStyle.selections = selections;
        }
        
        this.modalSheet.present();
    }

    closeModalSheet() {
        if(this.selectedStyle.totalAmount == 0){
        this.selectedStyle.selections = [];
        this.cdr.markForCheck();
        }
        return
    }

    build() {
        this.buildOrder.emit();
    }

    submit() {
        this.submitOrder.emit();
    }

    isColorSelected(color: IColors, spec?: ISpecification): boolean {
        if(spec) {
        //return this.selectedStyle.selections[specIndex].colors.some((c) => c._id === color._id);
        return this.selectedStyle.selections[this.selectedStyle.specifications.indexOf(spec)].colors.includes(color);
        } else {
        return this.selectedStyle.selectedColors.some((c) => c._id === color._id);
        }
    }

    toggleColor(color: IColors, spec?: ISpecification): void {
        let colorIndex;
    
        if(!spec) {
        colorIndex = this.selectedStyle.colors.findIndex((c) => c._id === color._id);

        if(this.isColorSelected(color)) {
            this.selectedStyle.selectedColors.splice(colorIndex, 1);
        } else {
            this.selectedStyle.selectedColors.push(color);
        }
        return;
        }
        
        colorIndex = spec!.colors.findIndex((c: IColors) => c.name === color.name);

        // console.log(this.selectedStyle.selections.indexOf(spec!));
        // console.log(this.isColorSelected(color, spec));
        if(this.isColorSelected(color, spec)) {
        this.selectedStyle.selections[this.selectedStyle.specifications.indexOf(spec!)].colors.splice(colorIndex, 1);  
        } else {
        // this.selectedStyle.selections[specIndex!].colors.push(color);
        this.selectedStyle.selections[this.selectedStyle.specifications.indexOf(spec!)].colors.push(color);
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
