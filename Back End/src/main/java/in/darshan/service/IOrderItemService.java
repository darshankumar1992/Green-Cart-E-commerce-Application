package in.darshan.service;


import in.darshan.entity.OrderItem;

public interface IOrderItemService {

	public OrderItem add(OrderItem orderItem);

	public void deleteOrderItemByOrderId(Integer orderId);

	

}
