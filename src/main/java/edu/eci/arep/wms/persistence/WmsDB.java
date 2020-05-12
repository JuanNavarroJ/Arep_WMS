/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package edu.eci.arep.wms.persistence;

import edu.eci.arep.wms.model.Product;
import edu.eci.arep.wms.model.Entity;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.springframework.stereotype.Service;

/**
 * 
 * 
 * @author Juan David
 */
@Service
public class WmsDB {

    // Atributos
    private static final String urlDb = "jdbc:postgresql://wmsdb.cu0adiovages.us-east-1.rds.amazonaws.com:5432/wmsdb?user=wmsdb&password=juanjuan";
    private Connection c;
    private Entity e;
    private Product p;

    /**
     * Metodo que permite generar la conexión con la base de datos.
     */
    public void getConnection() {
        try {
            c = DriverManager.getConnection(urlDb);
        } catch (SQLException e) {
        }
    }

    /****/
    //// BASE DE DATOS - Consultas de Entidad
    /****/

    public List<Entity> getAllEntities() {
        List<Entity> allEntities = new ArrayList<Entity>();
        Statement stmt = null;
        try {
            Class.forName("org.postgresql.Driver");
            getConnection();
            c.setAutoCommit(false);
            stmt = c.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT * FROM Entity;");
            c.close();
            while (rs.next()) {
                e = new Entity(rs.getString("entityname"), rs.getString("entityemail"), rs.getString("entitypassword"));
                e.setEntityId("entityid");
                e.setEntityProducts(getProductsByEntityName(e.getEntityId()));
                allEntities.add(e);
            }
            stmt.close();
            rs.close();
        } catch (Exception ex) {
            Logger.getLogger(WmsDB.class.getName()).log(Level.SEVERE, null, ex);
        }
        return allEntities;
    }

    public void createNewEntity(Entity en) {
        Statement stmt = null;
        try {
            Class.forName("org.postgresql.Driver");
            getConnection();
            c.setAutoCommit(false);
            stmt = c.createStatement();
            String sql = "INSERT INTO Entity (entityid,entityname,entityemail,entitypassword) "
                    + "VALUES ('" + en.getEntityId() + "','" + en.getEntityName() + "','"
                    + en.getEntityEmail() + "','"+ en.getEntityPassword() + "' )";
            stmt.executeUpdate(sql);
            stmt.close();
            c.commit();
            c.close();
        } catch (Exception ex) {
            Logger.getLogger(WmsDB.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    public Entity getEntityByName(String entityName) {
        PreparedStatement pstmt = null;
        e = null;
        try {
            Class.forName("org.postgresql.Driver");
            getConnection();
            c.setAutoCommit(false);
            String sql = "Select * from entity where entityname = ?";
            pstmt = c.prepareStatement(sql, ResultSet.TYPE_SCROLL_SENSITIVE, ResultSet.CONCUR_UPDATABLE);
            pstmt.setString(1, entityName);
            ResultSet rs = pstmt.executeQuery();
            c.close();
            if (rs.next()){
                e = new Entity(rs.getString("entityname"), rs.getString("entityemail"), rs.getString("entitypassword"));
                e.setEntityId(rs.getString("entityid"));
                e.setEntityProducts(getProductsByEntityName(e.getEntityId()));
            }
            pstmt.close();
            rs.close();
        } catch (Exception ex) {
            Logger.getLogger(WmsDB.class.getName()).log(Level.SEVERE, null, ex);
        }
        return e;
    }      
    
    public void deleteEntityByName(String entityName) {
        Statement stmt = null;
        try {
            Class.forName("org.postgresql.Driver");
            getConnection();
            c.setAutoCommit(false);
            String sql1 = "DELETE FROM entity WHERE entityname = '" + entityName + "'";
            stmt = c.createStatement();
            stmt.executeUpdate(sql1);
            c.commit();
            c.close();
        } catch (Exception ex) {
            Logger.getLogger(WmsDB.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    /****/
    //// BASE DE DATOS - Consultas de Producto
    /****/

    /**
     * Metodo que permite consular una lista con todos los productos registrados en
     * el webStore.
     * 
     * @return Retorna una lista de productos.
     */
    public List<Product> getAllProducts() {
        List<Product> allProduct = new ArrayList<Product>();
        Statement stmt = null;
        try {
            Class.forName("org.postgresql.Driver");
            getConnection();
            c.setAutoCommit(false);
            stmt = c.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT * FROM product;");
            c.close();
            while (rs.next()) {
                p = new Product(rs.getString("productname"), rs.getString("productdescription"), rs.getDouble("productprice"), rs.getInt("productcant"), rs.getString("productentity"));
                p.setProductId(rs.getString("productid"));
                allProduct.add(p);
            }
            stmt.close();
            rs.close();
        } catch (Exception ex) {
            Logger.getLogger(WmsDB.class.getName()).log(Level.SEVERE, null, ex);
        }
        return allProduct;
    }
    
    public void createNewProduct(Product pd) {
        Statement stmt = null;
        try {
            Class.forName("org.postgresql.Driver");
            getConnection();
            c.setAutoCommit(false);
            stmt = c.createStatement();
            String sql = "INSERT INTO product (productid,productname,productdescription,productprice,productcant,productentity) "
                    + "VALUES ('" + pd.getProductId() + "','" + pd.getProductName() + "','" + pd.getProductDescription()
                    + "','" + pd.getProductPrice() + "','" + pd.getProductCant() + "','" + pd.getProductEntity()
                    + "');";
            stmt.executeUpdate(sql);
            stmt.close();
            c.commit();
            c.close();
        } catch (Exception ex) {
            Logger.getLogger(WmsDB.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
    
    public void deleteProductById(String productId) {
        Statement stmt = null;
        try {
            Class.forName("org.postgresql.Driver");
            getConnection();
            c.setAutoCommit(false);
            String sql1 = "DELETE FROM product WHERE productid = '" + productId + "'";
            stmt = c.createStatement();
            stmt.executeUpdate(sql1);
            c.commit();
            c.close();
        } catch (Exception ex) {
            Logger.getLogger(WmsDB.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
    
    
    public List<Product> getProductsByEntityName(String entityId) {
        String SQL = "SELECT * FROM product WHERE productentity = ?";
        List<Product> allProductEnitiy = new ArrayList<Product>();
        try {
            Class.forName("org.postgresql.Driver");
            getConnection();
            c.setAutoCommit(false);
            PreparedStatement pstmt = c.prepareStatement(SQL, ResultSet.TYPE_SCROLL_SENSITIVE,
                    ResultSet.CONCUR_UPDATABLE);
            pstmt.setString(1, entityId);
            ResultSet rs = pstmt.executeQuery();
            c.close();
            while (rs.next()) {
                p = new Product(rs.getString("productname"), rs.getString("productdescription"), rs.getDouble("productprice"), rs.getInt("productcant"), rs.getString("productentity"));
                p.setProductId(rs.getString("productid"));
                allProductEnitiy.add(p);
            }
            pstmt.close();
            rs.close();
        } catch (Exception ex) {
            Logger.getLogger(WmsDB.class.getName()).log(Level.SEVERE, null, ex);
        }
        return allProductEnitiy;
    }

    public Product getProductById(String productId) {
        String SQL = "SELECT * FROM product WHERE productid = ? ";
        p = null;
        try {
            Class.forName("org.postgresql.Driver");
            getConnection();
            c.setAutoCommit(false);
            PreparedStatement pstmt = c.prepareStatement(SQL, ResultSet.TYPE_SCROLL_SENSITIVE,ResultSet.CONCUR_UPDATABLE);
            pstmt.setString(1, productId);
            ResultSet rs = pstmt.executeQuery();
            c.close();
            if (rs.next()){
                p = new Product(rs.getString("productname"), rs.getString("productdescription"), rs.getDouble("productprice"), rs.getInt("productcant"), rs.getString("productentity"));
                p.setProductId(rs.getString("productid"));
            }
            pstmt.close();
            rs.close();
        } catch (Exception ex) {
            Logger.getLogger(WmsDB.class.getName()).log(Level.SEVERE, null, ex);
        }
        return p;
    }
}