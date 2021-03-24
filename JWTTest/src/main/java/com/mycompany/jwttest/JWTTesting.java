package com.mycompany.jwttest;


//all of the io.jsonwebtoken imports are from the jjwt-api-0.11.2.jar from https://github.com/jwtk/jjwt
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import java.util.Scanner;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import java.util.Calendar;
import java.util.Date;
/**
 *
 * @author Jonathan Rhea
 * 
 * This is a test/showcase for JSON Web Tokens.
 * Obviously, all of this is subject to change and will look
 * very different when it's implemented into the shopping list app
 */
public class JWTTesting {

    //mos of the variables used.
    static UserInfo account1;
    static String enteredJwt = "";
    static String account1Jwt = "";
    static Calendar rightNow = Calendar.getInstance();
    static int currentTime;
    static int oneHourFromNow;
    
    //This key uses the HS256 signature algorithm  
    static Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    //This key uses the HS384 signature algorithm
    static Key badKey = Keys.secretKeyFor(SignatureAlgorithm.HS384);
    
    
    public static void main(String[] args) {
       
        createAccount();
        
        
        /*
        *This was just a test of my first time running with JWTs
        Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
        Key badKey = Keys.secretKeyFor(SignatureAlgorithm.HS384);
        String secretString = "CSC205CSC205CSC205CSC205CSC205CSC205CSC205CSC205";
        
        
        String subject = "Username: JonRhea";
        String subject2 = "Password: CSC205";

        String jws = Jwts.builder().claim("username:","JonRhea").claim("password:", "CSC205").signWith(keySecret).compact();
        
        System.out.printf("%s", jws);
        
        //assert Jwts.parserBuilder().setSigningKey(keySecret).build().parseClaimsJws(jws).getBody().getSubject().equals("Jon Rhea");
    
        
        try {
            Jwts.parserBuilder().setSigningKey(keySecret).build().parseClaimsJws(jws);
            System.out.printf("%nJWT is good!");
        }catch (JwtException e) {
            System.out.printf("%nJWT authorization failed!");
        }//end catch
        */
    }//end main
    
   
   public static void createAccount(){
       
       //ask the user to create a username
       System.out.printf("Enter a username.");
       Scanner input = new Scanner(System.in);
       String setUsername1 = input.nextLine();
    
       //ask for password 
       Scanner input3 = new Scanner(System.in);
       System.out.printf("%nEnter a password.");
       String setPassword1 = input3.nextLine();
       
        //create UserInfo object with the username and password entered
        account1 = new UserInfo(setUsername1, setPassword1);
      
        login();
    }//end createAccount
        
    
   public static void login(){
       
       //ask the user to input a username for an existing account
       Scanner input = new Scanner(System.in);
       System.out.printf("%nLogin: Enter a username.");
       String usernameEntered = input.nextLine();
       
       //ask the user to input a password for an existing account
       Scanner input2 = new Scanner(System.in);
       System.out.printf("%nEnter a password.");
       String passwordEntered = input2.nextLine();
       
       //get the username and passwords
       String account1Username = account1.getUsername();
       String account1Password = account1.getPassword();
       
      
       //building the JWT
       try{
        enteredJwt = buildJwtExpire(usernameEntered, passwordEntered);
        account1Jwt = buildJwt(account1Username, account1Password);
        }//end try
        catch(Exception exception){
            System.out.println("Error with JWT.");
        }//end catch

        System.out.printf("%s%n%s%n", account1Jwt, enteredJwt);

        Jws<Claims> jws;
        //checking the JWT to see if it is signed with the key we are looking for
        try {
            jws = Jwts.parserBuilder()  
            .setSigningKey(key)//if you put badKey here, it will trigger the exception        
            .build()                   
            .parseClaimsJws(enteredJwt); 

             // we can safely trust the JWT
             System.out.printf("%nWe can trust this JWT");
        }//end try
        catch (JwtException ex) {       

         // we cannot use the JWT as intended by its creator
        System.out.printf("%nDo not trust this JWT");
        }//end catch
               
 
   }//end login
   
   /**
    * 
    * @param userName The username the user entered in login
    * @param password The password the user entered in login
    * 
    * This JWT building method also adds an issue date and expiration date
    * They have to use java.util.Date according to the documentation
    * @return The JWT that is returned
    */
   private static String buildJwtExpire(String userName, String password) {
       
       Date issuedTime = new Date();
       Date expiration = new Date(System.currentTimeMillis() + 3600 * 1000);
           return Jwts.builder()
                   .claim("Username:", userName)
                   .claim("Password:", password)
                   .setIssuedAt(issuedTime)
                   .setExpiration(expiration)
                   .signWith(key)
                   .compact();
                   
   }//end buildJwt()
   
   /**
    * 
    * @param userName The username the user entered in login
    * @param password The password the user entered in login
    * 
    * This JWT building method does not create an issue and expiration date
    * This is just to that all a JWT needs is a header, atleast 1 claim
    * and a signed key.
    * @return The JWT that is returned
    */
   private static String buildJwt(String userName, String password) {
       
           return Jwts.builder()
                   .claim("Username:", userName)
                   .claim("Password:", password)
                   .signWith(key)
                   .compact();
                   
   }//end buildJwt()
   
  
}//end class
