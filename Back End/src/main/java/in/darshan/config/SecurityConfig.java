package in.darshan.config;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import in.darshan.serviceImpl.CustomerUserDetailsService;
import in.darshan.utils.JwtRequestFilter;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {
	
	@Autowired
	private JwtRequestFilter jwtRequestFilter;
	
	@Autowired
	private CustomerUserDetailsService customerUserDetailsService;
	
	    @Bean    
	    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception
		{
			http.csrf(csrf->csrf.disable())
			.cors(cors->cors.configurationSource(corsConfigurationSource()))
			.authorizeHttpRequests((req)->req
					//allowing /auth/** or /api/** without authentication
					.requestMatchers("/auth/**").permitAll()
					.requestMatchers("/api/**").permitAll()
					.anyRequest().authenticated());    //no can access with out authenticate
			http.sessionManagement(session->session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
			http.httpBasic(Customizer.withDefaults());            //http protocal authentication (like Alert)
			//http.formLogin(Customizer.withDefaults());          //login form with html css
			http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);
			return http.build();  //1                       2
		}
	 
	    @Bean
		public PasswordEncoder passwordEncoder() {
			return new BCryptPasswordEncoder();   //which uses hashing function to convert password to encrypted
		} 
	 
	    @Bean
	    public AuthenticationProvider authenticationProvider()
	    {
	    	DaoAuthenticationProvider daoAuthenticationProvider = new DaoAuthenticationProvider();
	    	daoAuthenticationProvider.setUserDetailsService(customerUserDetailsService);
	    	daoAuthenticationProvider.setPasswordEncoder(passwordEncoder());
	    	
	    	return daoAuthenticationProvider;
	    }
	 
	   @Bean
	   public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
		   return config.getAuthenticationManager(); 
	   }
	   
	   @Bean
		public CorsConfigurationSource corsConfigurationSource() {
	        CorsConfiguration corsConfiguration = new CorsConfiguration();
	        corsConfiguration.setAllowedOrigins(Arrays.asList("http://localhost:5173"));
	        corsConfiguration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
	        corsConfiguration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With"));
	        corsConfiguration.setAllowCredentials(true);
	        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
	        source.registerCorsConfiguration("/**", corsConfiguration);
	        return source;
	    }

}
