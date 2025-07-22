package in.darshan.utils;

import java.io.IOException;
import java.util.Collection;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import in.darshan.serviceImpl.CustomerUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtRequestFilter extends OncePerRequestFilter{
	
	private final JwtUtil jwtUtil;
	private final CustomerUserDetailsService userDetailsService;

	public JwtRequestFilter(JwtUtil jwtUtil,CustomerUserDetailsService userDetailsService) {
		this.jwtUtil = jwtUtil;
		this.userDetailsService=userDetailsService;
	
	}

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		
        String authHeader=request.getHeader("Authorization");
		
		if(authHeader == null || !authHeader.startsWith("Bearer ")) {
			filterChain.doFilter(request, response);  //just pass to next filter
			return;
		}
		
		
		if (authHeader != null) {

			String email = null;
			String jwt = null;
			String role = null;

			if (authHeader != null && authHeader.startsWith("Bearer ")) {
				jwt = authHeader.substring(7);
				email = jwtUtil.extractSubject(jwt);
				role = jwtUtil.extractClaims(jwt).get("role").toString();
			}

			if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {

				UserDetails userDetails = null;

				
				 if(role.equals("customer"))
				{
					userDetails = userDetailsService.loadCustomer(email);
				}
				if(role.equals("admin"))
				{
					userDetails = userDetailsService.loadAdmin(email);
				}
				
				
				 if (userDetails != null) {
				        Collection<? extends GrantedAuthority> authorities = userDetails.getAuthorities();

				        UsernamePasswordAuthenticationToken authToken =
				            new UsernamePasswordAuthenticationToken(userDetails, null, authorities);

				        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
				        SecurityContextHolder.getContext().setAuthentication(authToken);
				    }
			} 
		}
		
		filterChain.doFilter(request, response);
	}

}
