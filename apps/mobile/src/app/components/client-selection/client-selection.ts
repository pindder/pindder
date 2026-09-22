import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { IonContent, IonIcon, IonItem, IonList, IonSearchbar, IonSpinner, ModalController, ViewWillEnter,
  IonLabel, IonTitle, IonToolbar, IonButtons, IonButton, IonHeader
} from '@ionic/angular';
import { catchError, debounceTime, distinctUntilChanged, of, Subject, Subscription, switchMap, tap } from 'rxjs';
import { ClientService } from '../../services/client.service';
import { IClient } from '@pindder/contracts';

@Component({
  selector: 'app-client-selection',
  imports: [IonHeader, IonButton, IonButtons, IonToolbar, IonTitle, IonLabel, 
    IonSearchbar, IonContent, IonIcon, IonSpinner, IonList, IonItem
  ],
  templateUrl: './client-selection.html',
  styleUrl: './client-selection.css',
  standalone: true
})
export class ClientSelection implements ViewWillEnter, OnInit, OnDestroy{
  private searchSubject = new Subject<string>();
  private searchSubscription!: Subscription;
  private modalCtrl = inject(ModalController);
  private clientService = inject(ClientService);
  private cdr = inject(ChangeDetectorRef);

  searchResults: any[] = [];
  isLoading = false;
  selectedClient!: IClient;

  ionViewWillEnter(): void {
    
  }

  ngOnInit(): void {
    this.searchSubscription = this.searchSubject
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap(() => (this.isLoading = true)),
        switchMap((query) => {
          // If search box is empty, reset results without making an HTTP request
          if (!query) {
            this.isLoading = false;
            return of([]);
          }

          // Return the HTTP Observable directly to switchMap
          return this.clientService.searchClient(query).pipe(
            catchError((error: HttpErrorResponse) => {
              console.error('Search API Error:', error);
              this.isLoading = false;
              // Return an empty array wrapped in an Observable to keep the search pipeline alive
              return of([]);
            })
          );
        })
      )
      .subscribe({
        next: (res: any) => {
          console.log('Search results:', res);
          // Handle response format (e.g., res.data or res)
          this.searchResults = Array.isArray(res) ? res : (res?.data || []);
          this.isLoading = false;

          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Pipeline Error:', err);
          this.isLoading = false;
        }
      });
  }

  onSearchInput(event: any) {
    const value = event.target.value || '';
    this.searchSubject.next(value.trim());
  }

  selectClient(client: any) {
    // Dismiss and pass client back to app-new-order
    this.modalCtrl.dismiss(client, 'selected');
  }

  dismiss() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  ngOnDestroy() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }
}
