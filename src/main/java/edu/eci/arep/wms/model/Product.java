/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package edu.eci.arep.wms.model;

/**
 * 
 * @author Juan David
 */
public class Product {   
    
    //Atributos
    private String productId;
    private String productName;
    private String productDescription;
    private double productPrice;
    private int productCant;
    private String productEntity;

    public Product(String productName, String productDescription, double productPrice, int productCant, String productEntity) {
        this.productName = productName;
        this.productDescription = productDescription;
        this.productPrice = productPrice;
        this.productCant = productCant;
        this.productEntity = productEntity;
    }

    public String getProductId() {
        return productId;
    }

    public void setProductId(String productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getProductDescription() {
        return productDescription;
    }

    public void setProductDescription(String productDescription) {
        this.productDescription = productDescription;
    }

    public double getProductPrice() {
        return productPrice;
    }

    public void setProductPrice(double productPrice) {
        this.productPrice = productPrice;
    }

    public int getProductCant() {
        return productCant;
    }

    public void setProductCant(int productCant) {
        this.productCant = productCant;
    }

    public String getProductEntity() {
        return productEntity;
    }

    public void setProductEntity(String productEntity) {
        this.productEntity = productEntity;
    }

    
}
