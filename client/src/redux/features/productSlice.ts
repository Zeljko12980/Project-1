import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../models/Product'; // Adjust the import path if necessary
import { fetchReviews } from './reviewSlice';
import axios from 'axios';

interface Dimensions {
  Width: number;
  Height: number;
  Depth: number;
}

interface ProductDTO {
  Title: string;
  Description: string;
  Category: string;
  Price: number;  // C# decimal je u TS 'number'
  DiscountPercentage: number;
  Stock: number;
  Tags: string[];
  Brand: string;
  Sku: string;
  Weight: number;
  Dimensions: Dimensions;  // Objekt tipa Dimensions
  WarrantyInformation: string;
  ShippingInformation: string;
  AvailabilityStatus: string;
  ReturnPolicy: string;
  MinimumOrderQuantity: number;
  Images: string[];  // Lista slika
  Thumbnail: string;
  Barcode: string;
  QrCode: string;
}

// Define the initial state
interface ProductState {
  allProducts: Product[];
  featuredList: Product[];
  product: Product | null; 
  similarProducts: Product[];
  newList: Product[];
  categories: string[]; 
  loading: boolean;
  error: string | null;
  products:Product[]|null;
  currentPage: number; // Current page number
  totalProducts: number; // Total number of products
  totalPages: number; 
  paginatedProducts: Product[];
  status:string | null;
  editProduct:Product|null;
  searchTerm:string|null;
  updateProduct:Product|null;
}

const initialState: ProductState = {
  allProducts: [],
  product:null,
  featuredList: [],
  newList: [], 
  similarProducts:[],
  categories: [], // Start with an empty array of products
  loading: false,
  error: null,
  products:[],
  paginatedProducts: [],
  currentPage: 1, // Default to the first page
  totalProducts: 0, // Initial total count is 0
  totalPages: 0, // Initial total pages count is 0
  status:null,
  editProduct:null,
  searchTerm:null,
  updateProduct:null
};

export const fetchPaginatedProducts = createAsyncThunk<
  { products: Product[]; totalProducts: number; totalPages: number }, // The data we want to return
  { pageNumber: number; pageSize: number; searchTerm?: string } // Added searchTerm as optional
>(
  'product/fetchPaginatedProducts',
  async ({ pageNumber, pageSize, searchTerm }) => {
    // Construct the URL with optional searchTerm
    const url = new URL('http://localhost:5157/api/Products/stranica');
    url.searchParams.append('pageNumber', pageNumber.toString());
    url.searchParams.append('pageSize', pageSize.toString());
    if (searchTerm) {
      url.searchParams.append('searchTerm', searchTerm);
    }

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    const data = await response.json();
    const totalProducts = data.totalCount; // Adjust this according to your response structure
    const totalPages = data.TotalPages;

    console.log("Total products: " + totalProducts);

    return {
      products: data.products,
      totalProducts,
      totalPages,
    };
  }
);

// Thunk to fetch home products and update featured and new lists
export const fetchHomeProducts = createAsyncThunk<void>(
  'product/fetchHomeProducts',
  async (_, { dispatch }) => {
    const response = await fetch('http://localhost:5157/api/Products');
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    const data: any[] = await response.json();
    
    console.log('Fetched data:', data);  // Add this line to inspect the response

    const productList = data.map((product: any) => ({
      id: product.id,
      title: product.title,
      images: product.images,
      price: product.price,
      rating: product.rating,
      thumbnail: product.thumbnail,
      description: product.description,
      category: product.category,
      discountPercentage: product.discountPercentage,
    }));

    // Dispatch actions to update the featured and new product lists
    dispatch(updateFeaturedList(productList.slice(0, 8)));
    dispatch(updateNewList(productList.slice(8, 16)));
  }
);

export const fetchProductDetails = createAsyncThunk<Product, string>(
  "product/fetchProductDetails",
  async (productId,thunkAPI) => {
    const response = await fetch(`http://localhost:5157/api/products/${productId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch product details");
    }
    thunkAPI.dispatch(fetchReviews(Number(productId!)));
    return (await response.json()) as Product;
  }
);

// Async thunk to fetch similar products
export const fetchSimilarProducts = createAsyncThunk<Product[], string>(
  "product/fetchSimilarProducts",
  async (categoryName) => {
    const response = await fetch(`http://localhost:5157/api/Products/category/${categoryName}`);
    
    if (!response.ok) {
      throw new Error("Failed to fetch similar products");
    }

    // Await the JSON response and log it
    const data = await response.json();
    console.log("Fetched similar products:", data);

    // Return the products as an array of Product
    return data as Product[];
  }
);

// Thunk to fetch categories from the API
export const fetchCategories = createAsyncThunk<string[]>(
  'product/fetchCategories',
  async () => {
    const response = await fetch('http://localhost:5157/api/products/categories');
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    const data: string[] = await response.json(); // Assuming data is an array of category names
    return data;
  }
);

// Thunk to fetch all products from the API
export const fetchProducts = createAsyncThunk<Product[]>(
  'product/fetchProducts',
  async () => {
    const response = await fetch('http://localhost:5157/api/products');
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    return (await response.json()) as Product[];
  }
);

export const deleteProduct = createAsyncThunk<id>(
  'products/deleteProduct',
  async ({ id }, thunkAPI) => {
    try {
      const response = await axios.delete(`http://localhost:5157/api/products?id=${id}`);
  
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


export const addProduct = createAsyncThunk(
  "products/addProduct",
  async ({ productDTO }: { productDTO: ProductDTO }, { rejectWithValue }) => {
   
      console.log("DATA: "+productDTO);
      const response = await fetch('http://localhost:5157/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productDTO),
      });
      return response.data ;
   
  }
);



export const updateProductQuantity = createAsyncThunk(
  'product/updateProductQuantity',
  async ({ id, price,stock,availabilityStatus,discountPercentage,tags }, { rejectWithValue }) => {

    const tagsArray = tags.split(',').map(tag => tag.trim());
    try {
      // Sending PUT request to the API with updated quantity
      const response = await fetch(`http://localhost:5157/api/products/${id}/update-quantity`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({Price:price, Stock: stock,AvailabilityStatus:availabilityStatus,DiscountPercentage:discountPercentage,Tags:tagsArray }),
      });

     

      // Returning the updated product data if needed
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create the slice for products
const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    // Action to add products to the state (if needed later)
    addProducts(state, action: PayloadAction<Product[]>) {
      state.allProducts = action.payload;
    },
    // Update featured products list
    updateFeaturedList(state, action: PayloadAction<Product[]>) {
      state.featuredList = action.payload;
    },
    // Update new products list
    updateNewList(state, action: PayloadAction<Product[]>) {
      state.newList = action.payload;
    },
    // Add categories to the state
    addCategories(state, action: PayloadAction<string[]>) {
      state.categories = action.payload;
    },
    setEditProduct(state,action){
      state.editProduct=action.payload;
    },
    setSearchTerm(state,action){
      state.searchTerm=action.payload;
    },
    setUpdateProduct(state,action)
    {
      state.updateProduct=action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
    .addCase(fetchProducts.pending, (state) => {
      state.loading = true;
      state.error = null; // Reset error on new fetch
    })
    .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
      state.loading = false;
      state.allProducts = action.payload; // Store fetched products in 'allProducts'
      state.products = action.payload; // Optionally, you can also store it in 'products'
    })
    .addCase(fetchProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch products';
    })
      .addCase(fetchHomeProducts.pending, (state) => {
        state.loading = true;
        state.error = null; // Reset error on new fetch
      })
      .addCase(fetchHomeProducts.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(fetchHomeProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch home products';
      })
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null; // Reset error on new fetch
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload; // Store fetched categories in the state
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch categories';
      })
      .addCase(fetchProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch product details";
      })
      .addCase(fetchSimilarProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSimilarProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.similarProducts = action.payload;
      })
      .addCase(fetchSimilarProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch similar products";
      })
      .addCase(fetchPaginatedProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchPaginatedProducts.fulfilled,
        (state, action: PayloadAction<{ products: Product[]; totalProducts: number; totalPages: number }>) => {
          state.loading = false;
          state.paginatedProducts = action.payload.products;
          state.totalProducts = action.payload.totalProducts;
          state.totalPages = action.payload.totalPages;
        }
      )
      .addCase(fetchPaginatedProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch paginated products';
      })
      .addCase(deleteProduct.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = action.payload;
        state.allProducts=action.payload;
    
        // Update state with the new list
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.status = 'failed';
        //state.error = action.payload.error;
      })
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.allProducts.push(action.payload);
        state?.products?.push(action.payload); // Dodavanje novog proizvoda u stanje
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        //state.error = action.payload || "Something went wrong";
      })
      .addCase(updateProductQuantity.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateProductQuantity.fulfilled, (state, action) => {
        state.status = 'succeeded';

        // Find the product in paginatedProducts and update its quantity
        const updatedProduct = action.payload; // Ensure your API returns the updated product
        const productIndex = state.paginatedProducts.findIndex(
          (product) => product.id === updatedProduct.id
        );

        if (productIndex !== -1) {
          state.paginatedProducts[productIndex] = {
            ...state.paginatedProducts[productIndex],
            ...updatedProduct,
          };
        }
      })
      .addCase(updateProductQuantity.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const {setUpdateProduct, addProducts, addCategories, updateFeaturedList, updateNewList, setSearchTerm ,setEditProduct} = productSlice.actions;
export default productSlice.reducer;
