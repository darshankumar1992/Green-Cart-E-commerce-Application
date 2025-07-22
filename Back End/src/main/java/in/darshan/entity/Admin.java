package in.darshan.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name="admin")
public class Admin {
	
	@Id
	private Integer aid;
	
	private Double revenue;
	
	private Integer orders;

}
