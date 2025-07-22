package in.darshan.request;

import lombok.Data;

@Data
public class UserSignInRequest {
	
	private String email;
	private String password;

}
