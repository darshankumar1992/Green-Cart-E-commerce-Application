package in.darshan.serviceImpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import in.darshan.entity.User;
import in.darshan.repo.UserRepository;

@Service
public class CustomerUserDetailsService implements UserDetailsService{
	
	@Autowired
	private UserRepository userRepo;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		
		return null;
	}
	
	@Transactional
	public CustomerDetails loadCustomer(String email) {
		
		User user = userRepo.findByEmail(email).orElse(null);
		if(user == null)
		{
			throw new UsernameNotFoundException("User Not Found");
		}
		return new  CustomerDetails(user);
			
	}
	
	
	public AdminDetails loadAdmin(String email) {
		User user = userRepo.findByEmail(email).orElse(null);
		
		if(user == null)
		{
			throw new UsernameNotFoundException("User Not Found");
		}
		return new  AdminDetails(user);
	}
	

}
