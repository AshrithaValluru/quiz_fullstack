package com.quizmaster.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class QuizTheme {
    
    @Column(name = "primary_color")
    private String primaryColor = "#007bff";
    
    @Column(name = "background_color")
    private String backgroundColor = "#ffffff";
    
    @Column(name = "font_style")
    private String fontStyle = "Arial, sans-serif";
    
    // Constructors
    public QuizTheme() {}
    
    public QuizTheme(String primaryColor, String backgroundColor, String fontStyle) {
        this.primaryColor = primaryColor;
        this.backgroundColor = backgroundColor;
        this.fontStyle = fontStyle;
    }
    
    // Getters and Setters
    public String getPrimaryColor() {
        return primaryColor;
    }
    
    public void setPrimaryColor(String primaryColor) {
        this.primaryColor = primaryColor;
    }
    
    public String getBackgroundColor() {
        return backgroundColor;
    }
    
    public void setBackgroundColor(String backgroundColor) {
        this.backgroundColor = backgroundColor;
    }
    
    public String getFontStyle() {
        return fontStyle;
    }
    
    public void setFontStyle(String fontStyle) {
        this.fontStyle = fontStyle;
    }
}