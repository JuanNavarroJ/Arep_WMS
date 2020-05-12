/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package edu.eci.arep.wms.services.entity;

import edu.eci.arep.wms.model.Entity;
import java.util.List;

/**
 * 
 * @author Juan David
 */
public interface EntityServices {
    
    public List<Entity> getAllEntities();
    
    public void createNewEntity(Entity en);

    public Entity getEntityByName(String entityName);
    
    public void deleteEntityByName(String entityName);
    

}
