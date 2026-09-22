export interface IResponse<T> {
    statusCode: number;
    msg: string;
    data?: T;
    total?: number;
    page?: number;
    size?: number;
}

export interface GalleryItem {
  src: string;
  w: number; // width in px
  h: number; // height in px
  alt?: string;
}