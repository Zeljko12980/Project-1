namespace API.AutoMapper
{
    public class AddReviewDto
    {
        
              public int Rating { get; set; }
        public string Comment { get; set; }
        
       

         public int ProductId { get; set; }
         public Guid UserId{get;set;}
        
      
    }
}