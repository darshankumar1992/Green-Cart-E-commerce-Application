package in.darshan.controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.razorpay.Product;

import in.darshan.entity.ProductItem;
import in.darshan.exception.UserException;
import in.darshan.request.ProductAddRequest;
import in.darshan.request.ProductUpdateRequest;
import in.darshan.service.IProductService;
import in.darshan.serviceImpl.AdminDetails;
import in.darshan.serviceImpl.CustomerDetails;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api")
public class ProductController {
	
	@Autowired
	private IProductService service;
	
	@GetMapping("/product/all")
	public ResponseEntity<List<ProductItem>> getProducts(){
		System.out.println("all product");
		List<ProductItem> product=service.getAllProduct();
		return ResponseEntity.ok(product);
	}
	
	@GetMapping("product/topFive")
	public ResponseEntity<List<ProductItem>> topProduct(){
		System.out.println("top 5");
		List<ProductItem> product=service.topProduct();
		return ResponseEntity.ok(product);
	}
	
	@GetMapping("product/category")
	public ResponseEntity<List<ProductItem>> categoryProduct(@RequestParam String category){
		System.out.println("category product");
		List<ProductItem> item=service.categoryProduct(category);
		return ResponseEntity.ok(item);	
	}
	
	@GetMapping("/product/{id}")
	public ResponseEntity<?> getProductDataById(@PathVariable(name="id") Integer itemId){
		System.out.println("Product");
		CustomerDetails customerDetails =null;
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		
		if(authentication !=null && authentication.isAuthenticated() && !authentication.getPrincipal().equals("anonymousUser"))
		{
			customerDetails =  (CustomerDetails) authentication.getPrincipal();
		}
		
		ProductItem item = service.findById(itemId);
		
		Map<String, Object> response = new HashMap<>();
		response.put("ProductItem", item);
		
		return ResponseEntity.ok(response);	
		
	}
	
	@PostMapping("/products/add")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> addProduct(@AuthenticationPrincipal AdminDetails adminDetails, @RequestBody ProductAddRequest request ){
	    
	    if(adminDetails == null) {
	        throw new UsernameNotFoundException("Unauthorized");
	    }
	    System.out.println(request.getName()+" "+ request.getPrice()+" "+request.getDiscount());
	    
	    if(request.getName() == null || request.getName().isEmpty() ||
	       request.getImg() == null || request.getImg().isEmpty() ||
	       request.getAbout() == null || request.getAbout().isEmpty() ||
	       request.getDescription() == null || request.getDescription().isEmpty() ||
	       request.getCategory() == null || request.getCategory().isEmpty() ||
	       request.getDiscount() == null || request.getDiscount().isEmpty() ||
	       request.getPrice() == null || request.getPrice().isEmpty()) 
	    {
	        throw new UserException("Invalid Data");    
	    }
	    
	    ProductItem itemExists = service.findItemByNameAndCategory(request.getName(), request.getCategory());
	    
	    if(itemExists != null) {
	        throw new UserException("Product already exists");
	    }
	    
	    Double price=Double.valueOf(request.getPrice());
	    Integer discount=Integer.valueOf(request.getDiscount());
	    
	    ProductItem item = new ProductItem();
	    
	    item.setName(request.getName());
	    item.setCategory(request.getCategory());
	    item.setCreatedAt(LocalDateTime.now());
	    item.setDescription(request.getDescription());
	    item.setDiscount(discount);
	    item.setImg(request.getImg());
	    item.setPrice(price);
	    item.setRating(4); 
	    item.setAbout(request.getAbout());
	    
	    ProductItem add = service.saveProduct(item);
	    
	    Map<String , Object> response = new HashMap<>();
	    response.put("status", "Product Added Successfully");
	    response.put("data", add);
	    
	    return ResponseEntity.ok(response);
	}
	
	
	@GetMapping("/products/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> getProductById(@PathVariable(name="id") Integer itemId){
		System.out.println("Product");
		
		
		ProductItem item = service.findById(itemId);
		
		Map<String, Object> response = new HashMap<>();
		response.put("ProductItem", item);
		
		return ResponseEntity.ok(response);	
		
	}
	
	@PutMapping("/products/update")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> updateProduct(@RequestBody ProductUpdateRequest request){
		
		ProductItem product = service.getProductByItemId(request.getItemId());
		
		ProductItem updateProduct = new ProductItem();
		
		updateProduct.setItemId(request.getItemId());
		updateProduct.setName(request.getName());
		updateProduct.setDescription(request.getDescription());
		updateProduct.setPrice(request.getPrice());
		updateProduct.setCategory(request.getCategory());
		updateProduct.setImg(product.getImg());
		updateProduct.setDiscount(request.getDiscount());
		updateProduct.setRating(product.getRating());
		updateProduct.setAbout(request.getAbout());
		updateProduct.setCreatedAt(product.getCreatedAt());
		ProductItem item=service.UpdateProductById(updateProduct);
		
		Map<String, String> response=new HashMap<>();
		
		response.put("status","success");
		response.put("message", "Updated Successfuuly");
		
		return ResponseEntity.ok(response);
	}
	
	

}
