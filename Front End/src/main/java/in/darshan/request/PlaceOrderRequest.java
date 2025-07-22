package in.darshan.request;

import java.util.List;

import lombok.Data;


@Data
public class PlaceOrderRequest {
	
	private Integer userId;
	private String mode;
	private String deliveryAddress;
	private List<PlacedOrderItem> items;
	private Double totalAmount;
	private Integer checkoutAmount;
	private String razorPayId;
	private String source;

}
