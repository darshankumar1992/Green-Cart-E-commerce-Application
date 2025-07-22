package in.darshan.service;

import java.util.List;

import com.razorpay.Product;

import in.darshan.entity.ProductItem;

public interface IProductService {
	
	public List<ProductItem> getAllProduct();
	public List<ProductItem> topProduct();
	public List<ProductItem> categoryProduct(String category);
	public ProductItem findById(Integer itemId);
	public ProductItem findItemByNameAndCategory(String name, String category);
	public ProductItem saveProduct(ProductItem item);
	public ProductItem getProductByItemId(Integer itemId);
	public ProductItem UpdateProductById(ProductItem updateProduct);

}
