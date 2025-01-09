export interface AddReviewDto {
    rating: number; // Rating from 1 to 5
    comment: string; // The text content of the review
   
    productId: number; // The ID of the product being reviewed
    userId: string; // The ID of the user submitting the review
  }
  