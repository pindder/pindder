import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { IonTitle, IonHeader, IonToolbar, IonButtons, 
  IonBackButton, IonContent, ViewWillEnter, IonGrid, 
  IonRow, IonCol, ModalController,
  IonSearchbar, IonInfiniteScrollContent, IonInfiniteScroll, 
  InfiniteScrollCustomEvent} from "@ionic/angular";
import { AppService } from '../../services/app.service';
import { Router } from '@angular/router';
import { catchError, map, Observable, of, shareReplay, Subject, tap } from 'rxjs';
import { DataTypes, IOrderItem, IResponse } from '@pindder/contracts';
import { AsyncPipe } from '@angular/common';
import { AppButton, EmptyState, ItemList } from '@pindder/shared-ui';
import { HttpErrorResponse } from '@angular/common/http';
import { OrderService } from '../../services/order.service';
import { NewOrder } from '../new-order/new-order';

@Component({
  selector: 'app-orders',
  imports: [IonInfiniteScroll, IonInfiniteScrollContent, IonCol, IonRow, IonContent, IonBackButton, IonButtons,
    IonToolbar, IonHeader, IonTitle, EmptyState,
    IonGrid, IonRow, IonSearchbar, AsyncPipe, AppButton, ItemList
  ],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders implements ViewWillEnter, OnInit{
  private orderService = inject(OrderService);
  private appService = inject(AppService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private modalCtrl = inject(ModalController);
  private searchSubject = new Subject<string>();

  dataTypes = DataTypes;
  orders$!: Observable<IOrderItem[]>;
  isLoading = false;
  page = 1;
  limit = 20;
  hasMoreData = false;

  ionViewWillEnter(): void {
    this.fetchOrders();
  }

  ngOnInit(): void {
    this.orders$ = this.appService.createSearchStream<IOrderItem>(
      this.searchSubject,
      (query) => this.orderService.searchOrders(query).pipe(
        map((res: IResponse<any>) => res.data || []),
        tap((orders) => {
          this.orders$ = of(orders);
          console.log('Fetched Orders:', this.orders$);
          this.cdr.markForCheck(); // Trigger change detection when new data arrives
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('Fetch Orders Error:', error);
          this.orders$ = of([]); // Reset on error
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

  fetchOrders() {
    this.orders$ = this.orderService.fetchOrders(status)
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
  }

  viewOrder() {
    this.router.navigate(['app/orders', ]);
  }

  async openNewOrderModal() {
    const modal = await this.modalCtrl.create({
      component:  NewOrder
    });

    await modal.present();
  }

  onSearchInput(event: any) {
    const value = event.target.value || '';
    this.searchSubject.next(value);
  }

  onIonInfinite(event: InfiniteScrollCustomEvent) {
    this.page += 1;

    this.fetchOrders();
    setTimeout(() => {
      event.target.complete();
    }, 500);
  }

  navigate(order_id: string) {
    this.router.navigate([`app/orders/${order_id}`]);
  }
}
