package in.darshan.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import in.darshan.entity.Order;
import in.darshan.entity.OrderItem;

public interface IOrderService {

	public Order createOrder(Order order);

	public Page<Order> getAllOrdersByUserId(Integer id, Pageable pageable);

	public Order getOrderDataByOrderId(Integer orderId);

	public void deleteOrderByOrderId(Integer orderId);

	public List<Order> getAllOrders();

	public void updateStatus(Integer orderId, String status);

	public Integer getPendingData();

	

}
