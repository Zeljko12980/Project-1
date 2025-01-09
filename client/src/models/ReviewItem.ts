export interface ReviewItem {
  id: number;
  rating: number;
  comment: string;
  date: string; // You can adjust the type here if you're using Date objects or string dates
  productId: number;
  reviewerName: string;
  reviewerEmail: string;
}
