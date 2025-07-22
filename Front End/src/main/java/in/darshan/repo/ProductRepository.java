package in.darshan.repo;


import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import in.darshan.entity.ProductItem;

@Repository
public interface ProductRepository extends JpaRepository<ProductItem, Integer>{
	
	@Query(value = """
	        SELECT p.* FROM product p
	        JOIN (
	            SELECT category, MAX(price) AS max_price
	            FROM product
	            GROUP BY category
	        ) max_p ON p.category = max_p.category AND p.price = max_p.max_price
	    """, nativeQuery = true)
	public List<ProductItem> topItem();
	
	@Query("SELECT p from ProductItem p where p.category=:category")
	public List<ProductItem> getItem(String category);

	
	@Query("SELECT p FROM ProductItem p WHERE p.name=:name AND p.category=:category")
	public ProductItem findItemByNameAndCategory(@Param("name") String name,@Param("category")  String category);

	
	@Query("SELECT p FROM ProductItem p WHERE p.itemId=:itemId")
	public ProductItem getProductByItemId(@Param("itemId") Integer itemId);

}
