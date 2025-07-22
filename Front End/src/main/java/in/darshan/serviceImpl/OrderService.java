package in.darshan.serviceImpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import in.darshan.entity.Order;
import in.darshan.entity.OrderItem;
import in.darshan.repo.OrderRepository;
import in.darshan.service.IOrderService;

@Service
public class OrderService implements IOrderService{
	
	@Autowired
	private OrderRepository repo;

	@Override
	public Order createOrder(Order order) {
		
		return repo.save(order);
	}

	@Override
	public Page<Order> getAllOrdersByUserId(Integer id, Pageable pageable) {
		// TODO Auto-generated method stub
		return repo.getAllOrdersByUserId(id,pageable);
	}

	@Override
	public Order getOrderDataByOrderId(Integer orderId) {
		// TODO Auto-generated method stub
		return repo.getOrderDataByOrderId(orderId);
	}

	@Override
	public void deleteOrderByOrderId(Integer orderId) {
		// TODO Auto-generated method stub
		repo.deleteById(orderId);
	}

	@Override
	public List<Order> getAllOrders() {
		// TODO Auto-generated method stub
		return repo.getAllOrders();
	}

	@Override
	@Transactional
	public void updateStatus(Integer orderId, String status) {
		// TODO Auto-generated method stub
		
		repo.updateStatus(orderId,status);
	}

	@Override
	public Integer getPendingData() {
		// TODO Auto-generated method stub
		return repo.getPendingData();
	}

	

}
