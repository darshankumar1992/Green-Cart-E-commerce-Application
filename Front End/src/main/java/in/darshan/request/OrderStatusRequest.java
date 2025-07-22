package in.darshan.request;

import lombok.Data;

@Data
public class OrderStatusRequest {
	
	private Integer orderId;
	private String status;
	private double totalAmount;

}
