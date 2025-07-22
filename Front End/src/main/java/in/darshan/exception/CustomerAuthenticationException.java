package in.darshan.exception;

public class CustomerAuthenticationException extends RuntimeException{
	
	private static final long serialVersionUID = 1L;
	
	public CustomerAuthenticationException(String message) {
		super(message);
	}

}
