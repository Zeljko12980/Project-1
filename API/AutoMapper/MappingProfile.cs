using AutoMapper;
using API.Models; // Ako je vaš entitet u ovom namespace-u
using API.DTOs;
using API.AutoMapper; // Ako je vaš DTO u ovom namespace-u
namespace AutoMapper
{
public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Cart, CartDto>()
            .ForMember(dest => dest.CartItems, opt => opt.MapFrom(src => src.CartItems))
            .ForMember(dest => dest.Total, opt => opt.MapFrom(src => src.Total))
            .ForMember(dest => dest.DiscountedTotal, opt => opt.MapFrom(src => src.DiscountedTotal))
            .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.UserId))
            .ForMember(dest => dest.TotalProducts, opt => opt.MapFrom(src => src.TotalProducts))
            .ForMember(dest => dest.TotalQuantity, opt => opt.MapFrom(src => src.TotalQuantity));

        CreateMap<CartItem,API.DTOs.CartItemDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Title))
            .ForMember(dest => dest.Price, opt => opt.MapFrom(src => src.Price))
            .ForMember(dest => dest.Quantity, opt => opt.MapFrom(src => src.Quantity))
            .ForMember(dest => dest.Total, opt => opt.MapFrom(src => src.Total))
            .ForMember(dest => dest.DiscountPercentage, opt => opt.MapFrom(src => src.DiscountPercentage))
            .ForMember(dest => dest.DiscountedTotal, opt => opt.MapFrom(src => src.DiscountedTotal))
            .ForMember(dest => dest.Thumbnail, opt => opt.MapFrom(src => src.Thumbnail));

             CreateMap<CreateOrderDto, Order>()
            .ForMember(dest => dest.OrderItems, opt => opt.MapFrom(src => src.CartItems));

        CreateMap<API.AutoMapper.CartItemDto, OrderItem>()
        .ForMember(dest=>dest.UnitPrice,opt => opt.MapFrom(src=>src.Price))
        ;
    }
}
}