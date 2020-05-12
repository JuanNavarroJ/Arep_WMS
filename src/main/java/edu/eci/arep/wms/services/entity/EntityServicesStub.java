/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package edu.eci.arep.wms.services.entity;

import edu.eci.arep.wms.model.Entity;
import edu.eci.arep.wms.persistence.WmsDB;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * 
 * @author Juan David
 */
@Service
public class EntityServicesStub implements EntityServices{

    //Atributos
    @Autowired
    WmsDB wsdb;
    
    private void newDb(){
        wsdb = new WmsDB();
    }
    
    @Override
    public List<Entity> getAllEntities() {
        newDb();
        return wsdb.getAllEntities();
    }

    @Override
    public void createNewEntity(Entity en) {
        newDb();
        wsdb.createNewEntity(en);
    }

    @Override
    public Entity getEntityByName(String entityName) {
        newDb();
        return wsdb.getEntityByName(entityName);
    }

    @Override
    public void deleteEntityByName(String entityName) {
        newDb();
        wsdb.deleteEntityByName(entityName);
    }
}
