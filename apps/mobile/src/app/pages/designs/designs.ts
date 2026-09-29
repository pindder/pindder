import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { IonTitle, IonHeader, IonToolbar, IonButtons, 
  IonBackButton, IonContent, ViewWillEnter, IonGrid, 
  IonRow, IonCol, ModalController,
  IonSearchbar
} from "@ionic/angular";
import { DesignService } from '../../services/design.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DataTypes, IDesign, IResponse } from '@pindder/contracts';
import { EmptyState } from '../../components/empty-state/empty-state';
import { ListCard } from '../../components/list-card/list-card';
import { Router } from '@angular/router';
import { NewDesign } from '../../components/new-design/new-design';
import { PrimaryButton } from '../../components/primary-button/primary-button';
import { BehaviorSubject, catchError, map, Observable, of, shareReplay, Subject, tap } from 'rxjs';
import { AppService } from '../../services/app.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-designs',
  imports: [IonCol, IonRow, IonContent, IonBackButton, IonButtons,
    IonToolbar, IonHeader, IonTitle, EmptyState, ListCard,
    IonGrid, IonRow, PrimaryButton, IonSearchbar, AsyncPipe
  ],
  templateUrl: './designs.html',
  styleUrl: './designs.css',
})
export class Designs implements ViewWillEnter, OnInit{
  private designService = inject(DesignService);
  private appService = inject(AppService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private modalCtrl = inject(ModalController);
  private searchSubject = new Subject<string>();
  private designsSubject = new BehaviorSubject<IDesign[]>([]);

  dataTypes = DataTypes;
  designs$!: Observable<IDesign[]>;
  isLoading: boolean = false;

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
      () => this.designService.fetchDesigns().pipe(
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
    this.designs$ = this.designService.fetchDesigns()
    .pipe(
      map((res: IResponse<any>) => res.data || []),
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

    // this.designService.fetchDesigns().subscribe({
    //   next: (data) => {
    //     this.designs = data;
    //     this.cdr.markForCheck(); // Force Angular to update the view immediately
    //   },
    //   error: (err: HttpErrorResponse) => console.error(err)
    // });
  }

  updateDesignsList(design: IDesign) {
    // const index = this.designs.findIndex(d => d._id === design._id);
    // this.designs.splice(index, 1);

    const currentDesigns = this.designsSubject.getValue();
    const updatedDesigns = currentDesigns.filter(d => d._id !== design._id);
    
    this.designsSubject.next(updatedDesigns);
    this.cdr.markForCheck(); // Trigger change detection for OnPush
  }

  async openNewDesignModal() {
    const modal = await this.modalCtrl.create({
      component: NewDesign
    });

    await modal.present();
  }

  onSearchInput(event: any) {
    const value = event.target.value || '';
    this.searchSubject.next(value);
  }
}
