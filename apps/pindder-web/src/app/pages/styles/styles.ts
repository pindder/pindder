import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { IonTitle, IonHeader, IonToolbar, IonButtons, 
  IonBackButton, IonContent, ViewWillEnter, IonGrid, 
  IonRow, IonCol, ModalController,
  IonSearchbar, IonInfiniteScrollContent, IonInfiniteScroll, 
  InfiniteScrollCustomEvent} from "@ionic/angular";
import { DesignService } from '../../services/design.service';
import { AppService } from '../../services/app.service';
import { Router } from '@angular/router';
import { catchError, map, Observable, of, shareReplay, Subject, tap } from 'rxjs';
import { DataTypes, IDesign, IResponse } from '@pindder/contracts';
import { AsyncPipe } from '@angular/common';
import { AppButton, EmptyState, ItemList } from '@pindder/shared-ui';
import { HttpErrorResponse } from '@angular/common/http';
import { NewStyle } from '../new-style/new-style';

@Component({
  selector: 'app-styles',
  imports: [IonInfiniteScroll, IonInfiniteScrollContent, IonCol, IonRow, IonContent, IonBackButton, IonButtons,
    IonToolbar, IonHeader, IonTitle, EmptyState,
    IonGrid, IonRow, IonSearchbar, AsyncPipe, AppButton, ItemList],
  templateUrl: './styles.html',
  styleUrl: './styles.css',
})
export class Styles implements ViewWillEnter, OnInit{
  private designService = inject(DesignService);
  private appService = inject(AppService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private modalCtrl = inject(ModalController);
  private searchSubject = new Subject<string>();

  dataTypes = DataTypes;
  designs$!: Observable<IDesign[]>;
  isLoading = false;
  page = 1;
  limit = 20;
  hasMoreData = false;

  ionViewWillEnter(): void {
    this.fetchDesigns();
  }

  ngOnInit(): void {
    this.designs$ = this.appService.createSearchStream<IDesign>(
      this.searchSubject,
      (query) => this.designService.searchDesign(query).pipe(
        map((res: IResponse<any>) => res.data || []),
        tap((styles) => {
          this.designs$ = of(styles);
          console.log('Fetched Orders:', this.designs$);
          this.cdr.markForCheck(); // Trigger change detection when new data arrives
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('Fetch Orders Error:', error);
          this.designs$ = of([]); // Reset on error
          this.cdr.markForCheck();
          return of([]); // Return empty array to keep search stream alive
        })
      ),
      (loading) => {
        this.isLoading = loading;
        this.cdr.markForCheck(); // Trigger change detection for loading state updates
      },
      // Triggered when search bar is CLEARED (query is empty)
      () => this.designService.fetchDesigns(this.page, this.limit).pipe(
        map((res: IResponse<IDesign[]>) => res.data || [])
      )
    )
    .pipe(
      shareReplay(1), // 👈 Share execution across multiple async pipe subscriptions
      tap(() => this.cdr.markForCheck()) // Force change detection on data emit
    );
  }

  gotoStyle(style_id: string) {
    this.router.navigate(['app/styles/', style_id]);
  }

  fetchDesigns() {
    this.designs$ = this.designService.fetchDesigns(this.page, this.limit)
    .pipe(
      map((res: IResponse<any>) => {
        if(res.meta?.hasNextPage) {
          this.hasMoreData = true;
        }
        return res.data || []
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Fetch Orders Error:', error);
        return of([]); // Return empty array on error to keep stream alive
      }),
      tap((styles) => {
        this.isLoading = false;
        console.log(styles);
      })
    );
    this.cdr.markForCheck();
  }

  updateDesignsList(design: IDesign) {
    this.designs$ = this.designs$.pipe(
      map((designs: IDesign[]) => designs.filter(d => d._id != design._id))
    );
    console.log(this.designs$);
    this.cdr.markForCheck(); // Trigger change detection for OnPush
  }

  async openNewDesignModal() {
    const modal = await this.modalCtrl.create({
      component: NewStyle
    });

    await modal.present();

    //Listen for the selected design payload when dismissed
    const { data } = await modal.onWillDismiss();
    if (data) {
      this.updateDesignsList(data);
      this.designs$ = this.designs$.pipe(
        map((designs: IDesign[]) => [...designs, data])
      );
      console.log(this.designs$);
      this.cdr.markForCheck();
    }
  }

  onSearchInput(event: any) {
    const value = event.target.value || '';
    this.searchSubject.next(value);
  }

  onIonInfinite(event: InfiniteScrollCustomEvent) {
    this.page += 1;

    this.fetchDesigns();
    setTimeout(() => {
      event.target.complete();
    }, 500);
  }
}
