import { Injectable } from '@angular/core';
import { GalleryItem } from '@pindder/contracts';
import PhotoSwipe from 'photoswipe';

@Injectable({
  providedIn: 'root',
})
export class AppService {
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
}
