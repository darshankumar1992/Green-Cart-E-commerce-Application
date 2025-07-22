package in.darshan.serviceImpl;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import in.darshan.entity.OrderItem;
import in.darshan.repo.OrderItemRepository;
import in.darshan.service.IOrderItemService;
@Service
public class OrderItemService implements IOrderItemService{
	
	@Autowired
	private OrderItemRepository repo;

	@Override
	public OrderItem add(OrderItem orderItem) {
		
		return repo.save(orderItem);
	}

	@Override
	public void deleteOrderItemByOrderId(Integer orderId) {
		// TODO Auto-generated method stub
		repo.deleteById(orderId);
	}

	

}
