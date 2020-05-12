/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package edu.eci.arep.wms.services.product;

import edu.eci.arep.wms.model.Entity;
import edu.eci.arep.wms.model.Product;
import edu.eci.arep.wms.persistence.WmsDB;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * 
 * @author Juan David
 */
@Service
public class ProductServicesStub implements ProductServices{
    
    @Autowired
    WmsDB wsdb;

    private void newDb() {
        wsdb = new WmsDB();
    }

    @Override
    public List<Product> getAllProducts() {
        newDb();
        return wsdb.getAllProducts();
    }

    @Override
    public void createNewProduct(Product pr) {
        newDb();
        wsdb.createNewProduct(pr);
    }

    @Override
    public void deleteProductById(String productId) {
        newDb();
        wsdb.deleteProductById(productId);
    }

    @Override
    public List<Product> getProductsByEntityName(String entityName) {
        newDb();
        Entity e= wsdb.getEntityByName(entityName);
        return wsdb.getProductsByEntityName(e.getEntityId());
    }

    @Override
    public Product getProductById(String productId){
        newDb();
        return wsdb.getProductById(productId);
    }
}
