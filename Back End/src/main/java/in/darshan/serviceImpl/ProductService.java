package in.darshan.serviceImpl;


import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.razorpay.Product;

import in.darshan.entity.ProductItem;
import in.darshan.repo.ProductRepository;
import in.darshan.service.IProductService;

@Service
public class ProductService implements IProductService{
	
	@Autowired
	private ProductRepository repo;

	@Override
	public List<ProductItem> getAllProduct() {
		
		return repo.findAll();
	}

	@Override
	public List<ProductItem> topProduct() {
		
		return repo.topItem();
	}

	@Override
	public List<ProductItem> categoryProduct(String category) {
		// TODO Auto-generated method stub
		return repo.getItem(category);
	}

	@Override
	public ProductItem findById(Integer itemId) {
		// TODO Auto-generated method stub
		Optional<ProductItem> itemOptinal=repo.findById(itemId);
		return itemOptinal.get();
	}

	@Override
	public ProductItem findItemByNameAndCategory(String name, String category) {
		// TODO Auto-generated method stub
		return repo.findItemByNameAndCategory(name,category);
	}

	@Override
	public ProductItem saveProduct(ProductItem item) {
		// TODO Auto-generated method stub
		return repo.save(item);
	}

	@Override
	public ProductItem getProductByItemId(Integer itemId) {
		// TODO Auto-generated method stub
		return repo.getProductByItemId(itemId);
	}

	@Override
	public ProductItem UpdateProductById(ProductItem updateProduct) {
		// TODO Auto-generated method stub
		return repo.save(updateProduct);
		
	}

}
