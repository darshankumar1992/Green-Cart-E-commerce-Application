package in.darshan.repo;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import in.darshan.entity.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer>{

	
	@Query("SELECT o from Order o WHERE o.user.id=:id")
	public Page<Order> getAllOrdersByUserId(@Param("id") Integer id, Pageable pageable);

	
	@Query("SELECT o FROM Order o WHERE o.orderId=:orderId")
	public Order getOrderDataByOrderId(@Param("orderId")  Integer orderId);


	@Modifying
	@Transactional
	@Query("UPDATE Order o Set o.status=:status WHERE o.orderId=:orderId")
	public void updateStatus(@Param("orderId") Integer orderId,@Param("status") String status);


	@Query("SELECT COUNT(o) FROM Order o WHERE o.status = 'Pending'")
	public Integer getPendingData();


	@Query("SELECT o From Order o ORDER BY o.orderId DESC")
	public List<Order> getAllOrders();


}
