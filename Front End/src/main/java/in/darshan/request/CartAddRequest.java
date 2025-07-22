package in.darshan.request;

import lombok.Data;

@Data
public class CartAddRequest {
	
	private Integer itemId;
	private Integer userId;

}
