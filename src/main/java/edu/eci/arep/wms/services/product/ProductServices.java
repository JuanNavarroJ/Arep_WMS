/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package edu.eci.arep.wms.services.product;

import edu.eci.arep.wms.model.Product;
import java.util.List;


/**
 * 
 * @author Juan David
 */
public interface ProductServices {
    
    
    public List<Product> getAllProducts();
   
    
    public List<Product> getProductsByEntityName(String entityName);
    
    public Product getProductById(String productId);
    
    public void createNewProduct(Product pr);

    public void deleteProductById(String productId);

}
