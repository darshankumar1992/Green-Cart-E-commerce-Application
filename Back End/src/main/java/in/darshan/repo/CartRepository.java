package in.darshan.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import in.darshan.entity.Cart;

@Repository
public interface CartRepository extends JpaRepository<Cart, Integer>{

	@Query("SELECT COUNT(c) FROM Cart c WHERE c.user.id=:id")
	public Integer getCartCountByUserId(@Param("id") Integer userId);

	
	@Query("SELECT COUNT(c)>0 FROM Cart c WHERE c.user.id=:id AND c.productItem.itemId=:itemId ")
	public boolean existsByUserIdAndItemId(@Param("id") Long id, @Param("itemId") Long itemId);

	
    @Query("SELECT c FROM Cart c WHERE c.user.id=:id")
	public List<Cart> findCartById(@Param("id") Integer id);

    @Modifying
    @Query("DELETE FROM Cart c WHERE c.user.id=:id")
	public Integer deleteByCartItemByUserId(@Param("id") Integer id);


    @Query("SELECT c from Cart c WHERE c.cartId=:cartId")
	public Cart getCartByCartId(@Param("cartId") Integer cartId);

}
