/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package edu.eci.arep.wms.controllers;

import edu.eci.arep.wms.model.Entity;
import edu.eci.arep.wms.services.entity.EntityServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.springframework.http.HttpStatus;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.Map;
import org.bson.types.ObjectId;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

/**
 * 
 * @author Juan David
 */
@RestController
@RequestMapping(value = "/api")
public class EntityController {

    @Autowired
    EntityServices eService;

    @RequestMapping(method = RequestMethod.GET, path = "entities")
    public ResponseEntity<?> getAllEntities() {
        try {
            System.out.println("Consultando Las Entidades...");

            String data = new Gson().toJson(eService.getAllEntities());

            return new ResponseEntity<>(data, HttpStatus.ACCEPTED);
        } catch (Exception ex) {
            Logger.getLogger(EntityController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>("No se ha podido retornar las entidades", HttpStatus.NOT_FOUND);
        }
    }

    @RequestMapping(method = RequestMethod.POST, path = "entities")
    public ResponseEntity<?> createNewUser(@RequestBody String entity) {
        //Formato de json {"1":{"entityName":"Exito","entityEmail":"exito@gmail.com","entityPassword":"1234"}}
        try {
            System.out.println("Creando Nueva Entidad...");
            //Pasar el String JSON a un Map
            Type listType = new TypeToken<Map<Integer, Entity>>() {
            }.getType();
            Map<String, Entity> result = new Gson().fromJson(entity, listType);

            //Obtener las llaves del Map
            Object[] nameKeys = result.keySet().toArray();

            Entity en = result.get(nameKeys[0]);
            ObjectId newObjectIdUser = new ObjectId(new Date());
            en.setEntityId(newObjectIdUser.toHexString());
            
            eService.createNewEntity(en);

            return new ResponseEntity<>(HttpStatus.CREATED);

        } catch (Exception ex) {
            Logger.getLogger(EntityController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>("No se ha podido registrar la entidad", HttpStatus.FORBIDDEN);
        }
    }

    @RequestMapping(method = RequestMethod.GET, path = {"entities/{entityName}"})
    public ResponseEntity<?> getEntityByName(@PathVariable("entityName") String entityName) {
        try {
            System.out.println("Consultando entidad: "+entityName);
            Entity consulUser = eService.getEntityByName(entityName);

            String data = new Gson().toJson(consulUser);
                        
            return new ResponseEntity<>(data, HttpStatus.ACCEPTED);
        } catch (Exception ex) {
            Logger.getLogger(EntityController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>("No se ha podido retornar la entidad con el nombre: " + entityName, HttpStatus.NOT_FOUND);
        }
    }


    @RequestMapping(method = RequestMethod.DELETE, path = {"entities/{entityName}"})
    public ResponseEntity<?> deleteEntityByName(@PathVariable("entityName") String entityName) {
        try {
            System.out.println("Eliminando Entidad: "+entityName);
            eService.deleteEntityByName(entityName);

            return new ResponseEntity<>(HttpStatus.ACCEPTED);
        } catch (Exception ex) {
            Logger.getLogger(EntityController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>("No se ha podido eliminar la entidad: " + entityName, HttpStatus.FORBIDDEN);
        }
    }
}
