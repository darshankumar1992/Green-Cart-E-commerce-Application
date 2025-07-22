package in.darshan.request;

import lombok.Data;

@Data
public class ProductAddRequest {
	
	private String img;
	private String name;
	private String description;
	private String about;
	private String category;
	private String price;
	private String discount;
	
	

}
