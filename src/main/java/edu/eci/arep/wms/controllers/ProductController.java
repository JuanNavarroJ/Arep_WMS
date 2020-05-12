/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package edu.eci.arep.wms.controllers;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import edu.eci.arep.wms.model.Entity;
import edu.eci.arep.wms.model.Product;
import edu.eci.arep.wms.services.product.ProductServices;
import edu.eci.arep.wms.services.entity.EntityServices;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * 
 * @author Juan David
 */
@RestController
@RequestMapping(value = "/api")
public class ProductController {
    
    @Autowired
    ProductServices pService;
    
    @Autowired
    EntityServices eService;
    
    @RequestMapping(method = RequestMethod.GET, path = "products")
    public ResponseEntity<?> getAllProducts() {
        try {
            System.out.println("Consultando productos...");
            String data = new Gson().toJson(pService.getAllProducts());

            return new ResponseEntity<>(data, HttpStatus.ACCEPTED);
        } catch (Exception ex) {
            Logger.getLogger(ProductController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>("No se ha podido retornar los productos", HttpStatus.NOT_FOUND);
        }
    }
    
    @RequestMapping(method = RequestMethod.GET, path = {"products/{entityName}"})
    public ResponseEntity<?> getProductsByEntityName(@PathVariable("entityName") String entityName) {
        try {
            System.out.println("Consultando productos de la entidad: " +entityName);
            List<Product> products = new ArrayList<>();

            products = pService.getProductsByEntityName(entityName);

            String data = new Gson().toJson(products);

            return new ResponseEntity<>(data, HttpStatus.ACCEPTED);
        } catch (Exception ex) {
            Logger.getLogger(EntityController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>("No se ha podido retornar los productos de la entidad: " + entityName, HttpStatus.NOT_FOUND);
        }
    }

    @RequestMapping(method = RequestMethod.GET, path = {"products/{entityName}/{productId}"})
    public ResponseEntity<?> getProductByNicknameById(@PathVariable("entityName") String entityName, @PathVariable("productId") String producId) {
        try {
            System.out.println("Consultando producto: "+producId);

            Product product= pService.getProductByEntityNameAndProductName(entityName, producId);
            
            String data = new Gson().toJson(product);

            return new ResponseEntity<>(data, HttpStatus.ACCEPTED);
        } catch (Exception ex) {
            Logger.getLogger(EntityController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>("No se ha podido retornar el producto de la entidad: " + entityName, HttpStatus.NOT_FOUND);
        }
    }
    
    @RequestMapping(method = RequestMethod.POST, path = "products")
    public ResponseEntity<?> createNewProduct(@RequestBody String product ) {
        //Formato de json {"1":{"productName":"PruebaOnline","productDescription":"pruebaOnlineeeee","productPrice":"20000","productUser":"david","productImage":""}}
        try {
            System.out.println("Creando producto nuevo...");
            //Pasar el String JSON a un Map
            Type listType = new TypeToken<Map<Integer, Product>>() {
            }.getType();
            Map<String, Product> result = new Gson().fromJson(product, listType);
            
            //Obtener las llaves del Map
            Object[] nameKeys = result.keySet().toArray();
            
            Product pd = result.get(nameKeys[0]);
            
            
            //Entity en = eService.getEntityByName(product)pd.getProductEntity());
            
            ObjectId newObjectIdProduct = new ObjectId(new Date());
            pd.setProductId(newObjectIdProduct.toHexString());
            //pd.setProductUser(idUser.getIdUser());
            
            pService.createNewProduct(pd);
               
            return new ResponseEntity<>(HttpStatus.CREATED);
            
        } catch (Exception ex) {
            Logger.getLogger(EntityController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>("No se ha podido registrar el usuario", HttpStatus.FORBIDDEN);
        }
    }
    
    @RequestMapping(method = RequestMethod.DELETE, path = {"products/{usernickName}/{productId}"})
    public ResponseEntity<?> deleteProductById(@PathVariable("productId") String productId, @PathVariable("usernickName") String username) {
        try {
            System.out.println("Eliminando Producto: "+productId);
            //Entity us = uService.getUserByUserNickname(username);

            //pService.deleteProductByIdOfUserNickname(productId, "12");

            return new ResponseEntity<>(HttpStatus.ACCEPTED);
        } catch (Exception ex) {
            Logger.getLogger(EntityController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>("No se ha podido eliminar el producto con el id: " + productId,
                    HttpStatus.FORBIDDEN);
        }
    }
}
