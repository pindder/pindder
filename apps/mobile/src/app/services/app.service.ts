import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { /* DataTypes,*/ GalleryItem, IColors, IResponse } from '@pindder/contracts';
import PhotoSwipe from 'photoswipe';
import { catchError, debounceTime, distinctUntilChanged, finalize, Observable, of, Subject, switchMap } from 'rxjs';
import { environment } from '../../environments/environment.production';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private http = inject(HttpClient);
  toastCtrl = inject(ToastController);

  /**
   * Creates a reusable, debounced search stream for ANY API request function.
   * 
   * @param searchSubject The Subject receiving raw search inputs
   * @param apiFetcher Callback returning an Observable HTTP request for a query
   * @param setLoading Callback to update loading status in caller component/service
   * @param debounceMs Delay in milliseconds (default 500ms)
   */
  createSearchStream<T>(
    searchSubject: Subject<string>,
    apiFetcher: (query: string) => Observable<T[]>,
    setLoading: (isLoading: boolean) => void,
    defaultFetcher?: () => Observable<T[]>,
    debounceMs: number = 500
  ): Observable<T[]> {
    return searchSubject.pipe(
      debounceTime(debounceMs),
      distinctUntilChanged(),
      switchMap((query) => {
        const trimmedQuery = (query || '').trim();

        if (!trimmedQuery) {
          setLoading(false);
          return of([]);
        }

        // 1. Turn loading ON before making the HTTP call
        setLoading(true);

        // 2. If query is cleared/empty and a default fetcher exists, load default list
        if (!trimmedQuery) {
          if (defaultFetcher) {
            return defaultFetcher().pipe(
              catchError((error) => {
                console.error('Default Fetch Error:', error);
                return of([]);
              }),
              finalize(() => setLoading(false))
            );
          }
          // If no default fetcher provided, return empty list
          setLoading(false);
          return of([]);
        }

        // 3. Wrap inner API fetcher with finalize()
        return apiFetcher(trimmedQuery).pipe(
          catchError((error: HttpErrorResponse) => {
            console.error('Search Stream API Error:', error);
            return of([]); // Return empty array to keep stream alive
          }),
          finalize(() => {
            // 4. Guaranteed to run on success, error, OR switchMap cancellation!
            setLoading(false);
          })
        );
      })
    );
  }

  open(images: GalleryItem[], index = 0) {
    const pswp = new PhotoSwipe({
      dataSource: images,
      index: index,
      bgOpacity: 0.9,
      closeOnVerticalDrag: true, // Swipe down to close
      wheelToZoom: true,
    });

    pswp.init();
  }

  // Quick helper for single image viewing
  openSingle(src: string, width = 1200, height = 900) {
    this.open([{ src, w: width, h: height }]);
  }

  // Generate payment idempotency key
  generateKey(): string {
    return 'pay_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
  }

  showToast() {
    
  }

  fetchColors(): Observable<IResponse<IColors[]>> {
    return this.http.get<IResponse<IColors[]>>(`${environment.apiUrl}/colors`);
  }
}
