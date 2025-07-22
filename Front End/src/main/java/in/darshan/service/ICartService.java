package in.darshan.service;

import java.util.List;

import in.darshan.entity.Cart;

public interface ICartService {

	public Integer getCartItem(Integer userId);

	public boolean isSaved(Integer id, Integer productId);

	public void addToCart(Cart cart);

	public List<Cart> getCartDataByUserId(Integer id);

	public Integer deleteCartItemByUserId(Integer id);

	public Cart getCartDataByCartId(Integer cartId);

	public void deleteCartItem(Integer cartId);

}
