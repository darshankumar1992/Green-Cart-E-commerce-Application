package in.darshan.exception;

public class CartException extends RuntimeException{
	
	private static final long serialVersionUID = 1L;
	
    public CartException(String msg) {
		super(msg);
	}
}
