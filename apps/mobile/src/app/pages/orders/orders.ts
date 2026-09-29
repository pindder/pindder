import { ChangeDetectorRef, Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton, 
  IonSegmentButton, IonSegment, IonLabel, IonSegmentView, IonSegmentContent, 
  ViewWillEnter, IonModal, ModalController, IonList, /*IonIcon, IonButton,*/ 
  IonActionSheet,
  IonSearchbar
} from "@ionic/angular";
import { EmptyState } from "../../components/empty-state/empty-state";
import { OrderService } from '../../services/order.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTypes, IClient, IDesign, IOrderItem, IResponse, OrderStatus } from '@pindder/contracts';
import { NewOrder } from '../../components/new-order/new-order';
import { ClientService } from '../../services/client.service';
import { DesignService } from '../../services/design.service';
import { ListCard } from '../../components/list-card/list-card';
import { catchError, map, Observable, of, shareReplay, Subject, tap } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { AppService } from '../../services/app.service';
import { AsyncPipe } from '@angular/common';
import { PrimaryButton } from '../../components/primary-button/primary-button';

@Component({
  selector: 'app-orders',
  imports: [
    /*IonButton, IonIcon,*/
    FormsModule,
    IonModal,
    IonSegment,
    IonSegmentView,
    IonSegmentContent,
    IonSegmentButton,
    IonTitle,
    IonHeader,
    IonToolbar,
    IonContent,
    IonButtons,
    IonBackButton,
    IonLabel,
    EmptyState, NewOrder,
    ListCard,
    IonList,
    IonActionSheet,
    IonSearchbar,
    AsyncPipe, 
    PrimaryButton
  ],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders implements ViewWillEnter, OnInit{
  @ViewChild('modal') modal!: IonModal;

  private orderService = inject(OrderService);
  private clientService = inject(ClientService);
  private designService = inject(DesignService);
  private modalCtrl = inject(ModalController);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  private searchSubject = new Subject<string>();

  // Set default segment
  activeSegment: string = 'all';
  
  segmentData!: Observable<IOrderItem[]>;
  isLoading: boolean = false;

  private ar = inject(ActivatedRoute);
  private appService = inject(AppService);
  presentingElement!: HTMLElement | null;
  client_id = signal<string>("");
  design_id = signal<string>("");
  client!: IClient;
  design!: IDesign;
  dataTypes = DataTypes;
  isActionSheetOpen: boolean = false;
  actionSheetButtons = [
    {
      text: 'New Order',
      icon: 'bag-add-outline',
      handler: () => {
        this.openNewOrderModal();
      },
    },
  ] 

  ionViewWillEnter(): void {
    this.presentingElement = document.querySelector('.ion-page');
    const client_id = this.ar.snapshot.queryParamMap.get('client');
    const design_id = this.ar.snapshot.queryParamMap.get('style');

    if(client_id) {
      this.client_id.set(client_id);
      this.fetchClient(client_id);
    } else if(design_id) { 
      this.design_id.set(design_id);
      this.fetchDesign(design_id);
    } else {
      this.fetchOrders();
    }
  }

  ngOnInit(): void {
    this.segmentData = this.appService.createSearchStream<IOrderItem>(
      this.searchSubject,
      (query) => this.orderService.searchOrders(query).pipe(
        map((res: IResponse<any>) => res.data || []),
        tap((orders) => {
          this.segmentData = of(orders);
          console.log('Fetched Orders:', this.segmentData);
          this.cdr.markForCheck(); // Trigger change detection when new data arrives
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('Fetch Orders Error:', error);
          this.segmentData = of([]); // Reset on error
          this.cdr.markForCheck();
          return of([]); // Return empty array to keep search stream alive
        })
      ),
      (loading) => {
        this.isLoading = loading;
        this.cdr.markForCheck(); // Trigger change detection for loading state updates
      },
      // Triggered when search bar is CLEARED (query is empty)
      () => this.orderService.fetchOrders().pipe(
        map((res: IResponse<IOrderItem[]>) => res.data || [])
      )
    )
    .pipe(
      shareReplay(1), // 👈 Share execution across multiple async pipe subscriptions
      tap(() => this.cdr.markForCheck()) // Force change detection on data emit
    );
  }

  onSegmentChanged(event: CustomEvent) {
    const selectedValue = event.detail.value;
    this.activeSegment = selectedValue;
    this.fetchDataForSegment(selectedValue);
  }

  async fetchDataForSegment(segment: string) {
    this.isLoading = true;
    this.segmentData = of([]); // Reset data while loading

    switch (segment) {
      case 'all':
        this.fetchOrders();
        break;
      case 'pending':
        this.fetchOrders(OrderStatus.PENDING);
        break;
      case 'cancelled':
        this.fetchOrders(OrderStatus.CANCELLED);
        break;
      case 'completed':
        this.fetchOrders(OrderStatus.COMPLETED);
        break;
    }
  }

  fetchOrders(status?: string) {
    this.segmentData = of([]);

    this.segmentData = this.orderService.fetchOrders(status)
    .pipe(
      map((res: IResponse<any>) => res.data || []),
      catchError((error: HttpErrorResponse) => {
        console.error('Fetch Orders Error:', error);
        return of([]); // Return empty array on error to keep stream alive
      }),
      tap(() => {
        this.isLoading = false;
      })
    );
    this.cdr.markForCheck();
    // this.orderService.fetchOrders(status ?? '').subscribe({
    //   next: (res: IResponse<any>) => {
    //     this.segmentData = res.data;
    //     this.cdr.markForCheck();
    //   }, 
    //   error: (error: HttpErrorResponse) => {
    //     console.log(error);
    //   }
    // });
  }

  viewOrder(order_id: string) {
    console.log(order_id);
    this.router.navigate(['/app/orders/' + order_id ]);
  }

  fetchClient(client_id: string) {
    this.clientService.fetchClient(client_id).subscribe({
      next: (res: IResponse<any>) => {
        this.client = res.data;
        this.openNewOrderModal();
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      }
    });
  }

  fetchDesign(design_id: string) {
    this.designService.fetchDesign(design_id).subscribe({
      next: (res) => {
        //console.log(res.data);
        this.design = res.data;
        this.openNewOrderModal();
      },
      error: (error: any) => {
        console.log(error);
      }
    })
  }

  async openNewOrderModal() {
    const modal = await this.modalCtrl.create({
      component: NewOrder,
      componentProps: {
        client: this.client,
        design: this.design
      }
    });

    await modal.present();

    // Optionally listen for returned data when the modal is dismissed
    const { data } = await modal.onWillDismiss();
    if (data) {
      console.log('Returned data:', data);
    }
  }

  openActionSheet() {
    this.isActionSheetOpen = !this.isActionSheetOpen;
  }

  onSearchInput(event: any) {
    const value = event.target.value || '';
    this.searchSubject.next(value);
  }
}
