package in.darshan.request;

import lombok.Data;

@Data
public class ProductUpdateRequest {
	
	private Integer itemId;
	
	private String name;
	
	private String description;
	
	private String about;
	
	private String category;
	
	private Integer discount;
	
	private Double price;

}
