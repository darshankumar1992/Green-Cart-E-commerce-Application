package in.darshan.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import in.darshan.entity.Cart;
import in.darshan.entity.ProductItem;
import in.darshan.entity.User;
import in.darshan.exception.CartException;
import in.darshan.request.CartAddRequest;
import in.darshan.service.ICartService;
import in.darshan.service.IProductService;
import in.darshan.service.IUserService;
import in.darshan.serviceImpl.CustomerDetails;

@RestController
@RequestMapping("/api/cart")
public class CartController {
	private final Integer CART_MAX_LIMIT = 25;
	
	@Autowired
	private IUserService userService;
	@Autowired
	private ICartService cartService;
	@Autowired
	private IProductService productService;
	
	
	@PostMapping("/add")
	@PreAuthorize("hasRole('CUSTOMER')")
	public ResponseEntity<?> addCart(@AuthenticationPrincipal CustomerDetails customerDetails, @RequestBody CartAddRequest request){
		Map<String, String> response = new HashMap<>();
		
		if(customerDetails == null) {
			throw new UsernameNotFoundException("Unathorized");
		}
		
		if(request.getItemId() != null || request.getUserId() != 0) {
			
			User user = userService.findById(request.getUserId());
			
			if(user==null) {
				throw new CartException("Failed to add to cart");
			}
			
			if(cartService.getCartItem(request.getUserId()) >= CART_MAX_LIMIT) {
				throw new CartException("Reached Maximum Limit,Remove items from cart to add");
			}
			
			
			Cart cart= new Cart();
			cart.setQuantity(1);
			cart.setUser(user);
			
			if(cartService.isSaved(user.getId(), request.getItemId())) {
				throw new CartException("Already exists in cart");
			}
			
			ProductItem productItem = productService.findById(request.getItemId());
			
			if(productItem != null) {
				cart.setProductItem(productItem);
			}
			cartService.addToCart(cart);
			response.put("status", "success");
			response.put("message", "Item addedd to cart successfully");
		}
		
		return ResponseEntity.ok(response);
	}
	
	@GetMapping("/")
	@PreAuthorize("hasRole('CUSTOMER')")
	public ResponseEntity<?> getCartData(@AuthenticationPrincipal CustomerDetails customerDetails, @RequestParam Integer id){
		
		System.out.println("cart");
		if(customerDetails == null) {
			throw new UsernameNotFoundException("Unauthorized");
		}
		
		User user=userService.findById(id);
		
		if(user == null) {
			throw new CartException("User Not Found");
		}
		
		List<Cart> cartItems= cartService.getCartDataByUserId(id);
		
		return ResponseEntity.ok(cartItems);
	}
	
	@DeleteMapping("/")
	@PreAuthorize("hasRole('CUSTOMER')")
	public ResponseEntity<?> deleteCart( @RequestParam Integer cartId ){
		
		Map<String, String> response=new HashMap<>();
		
		Cart cart=cartService.getCartDataByCartId(cartId);
		
		if(cart ==  null) {
			throw new CartException("CartId is not correct");
		}
		
		cartService.deleteCartItem(cartId);
		
		response.put("status","success");
		response.put("message","Item removed successfully");
		
		return ResponseEntity.ok(response);
			
	}

}
