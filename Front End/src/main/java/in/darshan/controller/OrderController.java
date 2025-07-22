package in.darshan.controller;


import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import in.darshan.exception.OrderException;
import in.darshan.exception.UserException;
import in.darshan.entity.Admin;
import in.darshan.entity.Order;
import in.darshan.entity.OrderItem;
import in.darshan.entity.ProductItem;
import in.darshan.entity.User;
import in.darshan.request.OrderStatusRequest;
import in.darshan.request.PlaceOrderRequest;
import in.darshan.service.IAdminService;
import in.darshan.service.ICartService;
import in.darshan.service.IOrderItemService;
import in.darshan.service.IOrderService;
import in.darshan.service.IProductService;
import in.darshan.service.IUserService;
import in.darshan.serviceImpl.AdminDetails;
import in.darshan.serviceImpl.CartService;
import in.darshan.serviceImpl.CustomerDetails;

@RestController
@RequestMapping("/api/order")
public class OrderController {
	
	@Autowired
	private IUserService userService;
	@Autowired
	private IProductService productService;
	@Autowired
	private IOrderService orderService;
	@Autowired
	private IOrderItemService orderItemService;
	@Autowired
	private ICartService cartService;
	@Autowired
	private IAdminService adminService;
	
	
	@PostMapping("/")
	@Transactional
	@PreAuthorize("hasRole('CUSTOMER')")
	public ResponseEntity<?> createOrder(@AuthenticationPrincipal CustomerDetails customerDetails, @RequestBody PlaceOrderRequest request){
		System.out.println("order");
		System.out.println(request.getUserId());
		if(customerDetails == null) {
			throw new UsernameNotFoundException("Unauthorized");
		}
		
		User user = userService.findById(request.getUserId());
		
		if(user == null) {
			throw new UserException("User Not Found");
		}
		
		
		request.getItems().stream().forEach(o->{
			ProductItem productItem=productService.findById(o.getItemId());
			
			Order order =new Order();
			order.setDeliveryAddress(request.getDeliveryAddress());
			order.setPayMode(request.getMode());
			order.setStatus("Pending");
			order.setCreatedAt(LocalDate.now());
			order.setUser(user);
			order.setTotalAmount(request.getTotalAmount());
			
			order=orderService.createOrder(order);
			System.out.println(order);
			
			OrderItem orderItem =new OrderItem();
			orderItem.setProductItem(productItem);
			orderItem.setOrder(order);
			orderItem.setQuantity(o.getQuantity());
			orderItem.setPrice(request.getTotalAmount());
			orderItem=orderItemService.add(orderItem);
			
		});
		
		if(request.getSource().equals("cart")) {
			System.out.println("From cart");
			cartService.deleteCartItemByUserId(user.getId());
		}
		
		
		
		Map<String, String> response = new HashMap<>();
		response.put("status", "success");
		response.put("message", "Order Placed success");
		return ResponseEntity.ok(response);
		
	}
	
	@GetMapping("/user")
	@PreAuthorize("hasRole('CUSTOMER')")
	public ResponseEntity<?> getAllOrdersByUserId(
			@AuthenticationPrincipal CustomerDetails customerDetails,
			@RequestParam(defaultValue = "1", required = false) Integer page,
			@RequestParam(defaultValue = "5", required = false) Integer limit,
			@RequestParam Integer id){
		
		if(customerDetails == null) {
			throw new UsernameNotFoundException("Unauthorized");
		}
		
		User user=userService.findById(id);
		
		if(user == null) {
			throw new UserException("User Not found");
		}
		
		page=page-1;
		Pageable pageable=PageRequest.of(page, limit, Sort.by("orderId").descending());
		
		Page<Order> order=orderService.getAllOrdersByUserId(user.getId(),pageable);
		
		Map<String, Object> response=new HashMap<>();
		//1 success message
		response.put("status", "success");
		
		List<Map<String, Object>> orderList = getOrderAllInfo(order);
		//2   adding transformed data
		response.put("orders", orderList);
		response.put("userName", user.getName());
		
		
		Map<String, Object> paginationMap = new HashMap<>();
		paginationMap.put("totalElements",order.getTotalElements());
		paginationMap.put("hasNext", order.hasNext());
		paginationMap.put("hasPrevious", order.hasPrevious());
		paginationMap.put("isLast", order.isLast());
		paginationMap.put("totalPages", order.getTotalPages());
		
		response.put("pagination", paginationMap);
		return ResponseEntity.ok(response);
		
	}
	
	@DeleteMapping("/")
	@PreAuthorize("hasRole('CUSTOMER')")
	public ResponseEntity<?> deleteOrderByOrderId(@RequestParam Integer orderId){
		Map<String, String> response=new HashMap<>();
		
		Order order=orderService.getOrderDataByOrderId(orderId);
		
		if(order ==  null) {
			throw new OrderException("Order Data is Empty");
		}
		
		
		orderService.deleteOrderByOrderId(orderId);
		
		
		
		response.put("status","success");
		response.put("message","Item removed successfully");
		
		return ResponseEntity.ok(response);
	}
	
	@GetMapping("/getAllOrder")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> getAllOrders(@AuthenticationPrincipal AdminDetails adminDetails){
		if(adminDetails == null) {
	        throw new UsernameNotFoundException("Unauthorized");
	    }
		
		List<Order> orders = orderService.getAllOrders();
		
		Map<String, Object> response= new HashMap<>();
		response.put("status", "success");
		
		List<Map<String, Object>> orderList=getAllOrderInfo(orders);
		
		
		response.put("orders", orderList);
		
		return ResponseEntity.ok(response);
	}
	
	


	private List<Map<String, Object>> getAllOrderInfo(List<Order> orders) {
		
		return orders.stream().map(order -> {
			Map<String, Object> orderMap = new HashMap<>();
			
			orderMap.put("orderId", order.getOrderId());
			orderMap.put("deliveryAddress", order.getDeliveryAddress());
			orderMap.put("totalAmount", order.getTotalAmount());
			orderMap.put("status", order.getStatus());
			orderMap.put("payMode", order.getPayMode());
			orderMap.put("date", order.getCreatedAt());
			
			if(order.getUser() != null) {
				order.getUser().setPassword(null);
				order.getUser().setEmail(null);
				orderMap.put("orderBy", order.getUser());
			}
			
			if(order.getOrderItems() != null) {
				List<Map<String, Object>> orderItemList = order.getOrderItems().stream().map(orderItem -> {
					Map<String, Object> orderItemMap = new HashMap<>();
					orderItemMap.put("orderDetails", orderItem);
					orderItemMap.put("productItem", orderItem.getProductItem());
					
					return orderItemMap;
					
				}).collect(Collectors.toList());
				
				orderMap.put("orderItem", orderItemList);
			}
			return orderMap;
		}).collect(Collectors.toList());
	}

	private List<Map<String, Object>> getOrderAllInfo(Page<Order> order) {
		
		                         //transforming the data
		List<Map<String, Object>> orderList=order.stream().map(orders->{
			Map<String, Object> orderMap=new HashMap<>();
			
			orderMap.put("orderId", orders.getOrderId());
			orderMap.put("deliveryAddress",orders.getDeliveryAddress());
			orderMap.put("totalAmount", orders.getTotalAmount());
			orderMap.put("status", orders.getStatus());
			orderMap.put("payMode", orders.getPayMode());
			orderMap.put("date", orders.getCreatedAt());
			
			if(orders.getUser() != null) {
				orders.getUser().setPassword(null);
				orders.getUser().setEmail(null);
				orderMap.put("OrderBy", orders.getUser());
			}
			
			if(orders.getOrderItems() != null) {
				List<Map<String, Object>> orderItemList = orders.getOrderItems().stream().map(orderItem->{
					Map<String, Object> orderItemMap=new HashMap<>();
					
					orderItemMap.put("orderDetails", orderItem);
					orderItemMap.put("productItem",orderItem.getProductItem());
					return orderItemMap;
				}).collect(Collectors.toList());
				
				orderMap.put("orderItem", orderItemList);
			}
			
			return orderMap;
		}).collect(Collectors.toList());
		
		return orderList;
	}
	
	
	@PutMapping("/updateStatus")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> updateStatus(@AuthenticationPrincipal AdminDetails adminDetails, @RequestBody OrderStatusRequest request){
		
		if(adminDetails == null) {
	        throw new UsernameNotFoundException("Unauthorized");
	    }
		
		orderService.updateStatus(request.getOrderId(),request.getStatus());
		
		adminService.updateValues(request.getTotalAmount(),1);
		
		
		Map<String, String> response=new HashMap<>();
		
		response.put("status", "success");
		
		return ResponseEntity.ok(response);
	}
	
	
	@GetMapping("/getRevenue")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> getRevenueData(@AuthenticationPrincipal AdminDetails adminDetails){
		
		if(adminDetails == null) {
	        throw new UsernameNotFoundException("Unauthorized");
	    }
		
		Admin admin=adminService.getRevenueData();
		
		Integer totalUser =userService.getTotalUser();
		
		Integer totalPending = orderService.getPendingData();
		
		Map<String, Object> response= new HashMap<>();
		
		response.put("status", "success");
		response.put("revenue", admin);
		response.put("totalUser", totalUser);
		response.put("totalPending", totalPending);
		
		return ResponseEntity.ok(response);
	}

}
