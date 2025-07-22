package in.darshan.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;



import in.darshan.entity.User;
import in.darshan.exception.UserException;
import in.darshan.request.UserSignInRequest;
import in.darshan.request.UserSignUpRerquest;
import in.darshan.service.IUserService;
import in.darshan.serviceImpl.AdminDetails;
import in.darshan.serviceImpl.CustomerDetails;
import in.darshan.utils.JwtUtil;

@RestController
@RequestMapping("/auth")
public class UserController {
	
	@Autowired
	private IUserService service;
	@Autowired
	private PasswordEncoder passwordEncoder;
	@Autowired
	private JwtUtil jwtUtil;
	
	
	
	@PostMapping("/user/register")
	public ResponseEntity<?> register(@RequestBody UserSignUpRerquest request ) {
		
		if (request.getAddress().isEmpty() || request.getAddress() == null || request.getEmail().isEmpty()
				|| request.getEmail() == null || request.getName().isEmpty() || request.getName() == null
				|| request.getPassword().isEmpty() || request.getPassword() == null
				|| request.getPhoneNumber().isEmpty() || request.getPhoneNumber() == null) {
			throw new UserException("Invalid user Data");
		}
		
		User userExists=service.findByEmail(request.getEmail());
		if (userExists != null) {
			throw new UserException("Email Already Exists");
		}
		
		User user=new User();
		user.setName(request.getName());
		user.setEmail(request.getEmail());
		user.setAddress(request.getAddress());
		user.setPhoneNumber(request.getPhoneNumber());
		user.setPassword(passwordEncoder.encode(request.getPassword()));
		
		User saveRecord=service.createUser(user);
		
		Map<String, Object> claims=new HashMap<>();
		claims.put("email",saveRecord.getEmail());
		claims.put("role","customer");
		
		String generatedToken=jwtUtil.generateToken(saveRecord.getEmail(), claims);
		
		
		Map<String, String> response = new HashMap<>();
		response.put("status","success");
		response.put("token", generatedToken);
		return ResponseEntity.ok(response);
	}
	
	@PostMapping("/user/login")
	public Map<String,String> login(@RequestBody UserSignInRequest req){
		
		if(req.getEmail()==null || req.getEmail().isEmpty() ||
				req.getPassword()==null || req.getPassword().isEmpty()) {
			throw new UserException("Invalid Data");
		}
		System.out.println(req.getEmail());
		
		User findUser=service.findByEmail(req.getEmail());
		
		if(findUser==null) {
			throw new UserException("Email Not Found");
		}
		if(findUser.getId() == 1) {
			throw new UserException("Unauthorize");
		}
		if(!passwordEncoder.matches(req.getPassword(), findUser.getPassword())) {
			throw new UserException("Incorrect Password");
		}
		
		Map<String , Object> claims=new HashMap<>();
		
			claims.put("role", "customer");
			System.out.println("customer");
		
		claims.put("email", findUser.getEmail());
		
		
		Map<String, String> response = new HashMap<>();
		
		response.put("status","success");
		response.put("token", jwtUtil.generateToken(findUser.getEmail(), claims));
		
		return response;
	}
	
	@GetMapping("/user/profile")
	@PreAuthorize("hasRole('CUSTOMER')")
	public ResponseEntity<?> getProfileByToken(@AuthenticationPrincipal CustomerDetails customerDetails){
		System.out.println("User Data");
		
		if(customerDetails == null) {
			throw new UsernameNotFoundException("Unauthorized");
		}
		return ResponseEntity.ok(customerDetails.getUser());
		
	}
	
	@PostMapping("/admin/login")
	public Map<String,String> adminlogin(@RequestBody UserSignInRequest req){
		
		if(req.getEmail()==null || req.getEmail().isEmpty() ||
				req.getPassword()==null || req.getPassword().isEmpty()) {
			throw new UserException("Invalid Data");
		}
		System.out.println(req.getEmail());
		
		if(!req.getEmail().equals("darshan@gmail.com")) {
			throw new UserException("Only Admin can login");
		}
		
		User findUser=service.findByEmail(req.getEmail());
		
		if(findUser==null) {
			throw new UserException("Email Not Found");
		}
		if(!passwordEncoder.matches(req.getPassword(), findUser.getPassword())) {
			throw new UserException("Incorrect Password");
		}
		
		Map<String , Object> claims=new HashMap<>();
		
			claims.put("role","admin");
			System.out.println("admin");
		
		
		claims.put("email", findUser.getEmail());
		
		
		Map<String, String> response = new HashMap<>();
		
		response.put("status","success");
		response.put("token", jwtUtil.generateToken(findUser.getEmail(), claims));
		
		return response;
	}
	
	@GetMapping("/admin/aprofile")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> getAdminProfileByToken(@AuthenticationPrincipal AdminDetails adminDetails){
		System.out.println("admin Data");
		if(adminDetails == null) {
			throw new UsernameNotFoundException("Unauthorized");
		}
		System.out.println("Admin data");
		return ResponseEntity.ok(adminDetails.getUser());
		
	}
	
	@GetMapping("/admin/userData")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> getCustomerData(@AuthenticationPrincipal AdminDetails adminDetails){
		if(adminDetails == null) {
			throw new UsernameNotFoundException("Unauthorized");
		}
		
		List<User> user=service.getCustomerData();
		
		System.out.println(user);
		
		return ResponseEntity.ok(user);
		
		
	}
	
}
