/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package edu.eci.arep.wms.model;

import java.util.List;

/**
 * 
 * @author Juan David
 */
public class Entity {

    private String entityId;
    private String entityName;
    private String entityEmail;
    private String entityPassword;
    
    private List entityProducts;

    public Entity(String entityName, String entityEmail, String entityPassword) {
        this.entityName = entityName;
        this.entityEmail = entityEmail;
        this.entityPassword = entityPassword;
    }

    public String getEntityId() {
        return entityId;
    }

    public void setEntityId(String entityId) {
        this.entityId = entityId;
    }

    public String getEntityName() {
        return entityName;
    }

    public void setEntityName(String entityName) {
        this.entityName = entityName;
    }

    public String getEntityEmail() {
        return entityEmail;
    }

    public void setEntityEmail(String entityEmail) {
        this.entityEmail = entityEmail;
    }

    public String getEntityPassword() {
        return entityPassword;
    }

    public void setEntityPassword(String entityPassword) {
        this.entityPassword = entityPassword;
    }

    public List getEntityProducts() {
        return entityProducts;
    }

    public void setEntityProducts(List entityProducts) {
        this.entityProducts = entityProducts;
    }

    
}