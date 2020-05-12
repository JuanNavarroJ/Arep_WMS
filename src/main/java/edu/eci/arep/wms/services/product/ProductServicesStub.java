/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package edu.eci.arep.wms.services.product;

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
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    public void deleteProductByEntityAndName(String productName, String entityName) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    public List<Product> getProductsByEntityName(String entityName) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    public Product getProductByEntityNameAndProductName(String entityName, String productName) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }


}
