package in.darshan.entity;

import java.time.LocalDateTime;


import org.springframework.data.annotation.CreatedDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name="product")

public class ProductItem {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer itemId;
	
	private String name;
	
	private String description;
	
	private Double price;
	
	private String category;
	
	private String img;
	
	private Integer discount;
	
	private Integer rating;
	
	private String about;
	
	@CreatedDate
	private LocalDateTime createdAt;
	

}
