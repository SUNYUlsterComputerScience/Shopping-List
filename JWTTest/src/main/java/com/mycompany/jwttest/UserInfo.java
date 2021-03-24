package com.mycompany.jwttest;

/**
 *
 * @author Jonathan Rhea
 * 
 * This is a simple class to replicate a user's info like username and password
 */
public class UserInfo {
    
    private String username;
    private String password;
    
    public UserInfo(String username, String password){
        this.username = username;
        this.password = password;
    }//end constructor

    public void setUsername(String username) {
        this.username = username;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }
}
