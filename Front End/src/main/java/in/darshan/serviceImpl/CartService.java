package in.darshan.serviceImpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import in.darshan.entity.Cart;
import in.darshan.repo.CartRepository;
import in.darshan.service.ICartService;

@Service
public class CartService implements ICartService{
	
	@Autowired
	private CartRepository repo;

	@Override
	public Integer getCartItem(Integer userId) {
		// TODO Auto-generated method stub
		return repo.getCartCountByUserId(userId);
	}

	@Override
	public boolean isSaved(Integer id, Integer itemId) {
		// TODO Auto-generated method stub
		return repo.existsByUserIdAndItemId(id.longValue(),itemId.longValue());
	}

	@Override
	public void addToCart(Cart cart) {
		// TODO Auto-generated method stub
		repo.save(cart);
	}

	@Override
	public List<Cart> getCartDataByUserId(Integer id) {
		// TODO Auto-generated method stub
		return repo.findCartById(id);
	}

	@Override
	public Integer deleteCartItemByUserId(Integer id) {
		
		 return repo.deleteByCartItemByUserId(id);
		
	}

	@Override
	public Cart getCartDataByCartId(Integer cartId) {
		// TODO Auto-generated method stub
		return repo.getCartByCartId(cartId);
	}

	@Override
	public void deleteCartItem(Integer cartId) {
		
		repo.deleteById(cartId);
		
	}

}
