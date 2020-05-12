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
                /**
                p = new Product(rs.getString("productname"), rs.getString("productdescription"),
                        rs.getDouble("productprice"), rs.getString("productImage"));
                p.setProductId(rs.getString("productid"));
                allProduct.add(p);**/
            }
            stmt.close();
            rs.close();
        } catch (Exception ex) {
            Logger.getLogger(WmsDB.class.getName()).log(Level.SEVERE, null, ex);
        }
        return allProduct;
    }

    /**
     * Metodo que permite consultar todos los productos relacionados a un usuario.
     * 
     * @param userNickname Es el nickName del usario.
     * @return Retorna una lista de productos relacionados al usario dado.
     */
    public List<Product> getAllProductsOfUserNickname(String userNickname) {
        String SQL = "SELECT * FROM product WHERE productuser = ?";
        List<Product> allProductUser = new ArrayList<Product>();
        try {
            /**
            if (u == (null)) {
                u = getUserByUserNickname(userNickname);
            }
            * **/
            getConnection();
            PreparedStatement pstmt = c.prepareStatement(SQL, ResultSet.TYPE_SCROLL_SENSITIVE,
                    ResultSet.CONCUR_UPDATABLE);
            pstmt.setString(1, userNickname);
            ResultSet rs = pstmt.executeQuery();
            c.close();
            while (rs.next()) {
                /**
                p = new Product(rs.getString("productname"), rs.getString("productdescription"),
                        rs.getDouble("productprice"), rs.getString("productImage"));
                p.setProductId(rs.getString("productid"));

                allProductUser.add(p);
                * **/
            }
            // Se Agregan todos los productos al usuario.
            //u.setProducts(allProductUser);
            pstmt.close();
            rs.close();
        } catch (Exception ex) {
            Logger.getLogger(WmsDB.class.getName()).log(Level.SEVERE, null, ex);
        }
        return allProductUser;
    }

    public Product getProductByIdOfUserNickname(String id) {
        String SQL = "SELECT * FROM product WHERE productid = ?";
        Product product = null;
        try {
            
            getConnection();
            PreparedStatement pstmt = c.prepareStatement(SQL, ResultSet.TYPE_SCROLL_SENSITIVE,
                    ResultSet.CONCUR_UPDATABLE);
            pstmt.setString(1, id);
            ResultSet rs = pstmt.executeQuery();
            c.close();
            while (rs.next()) {
                /**
                p = new Product(rs.getString("productname"), rs.getString("productdescription"),
                        rs.getDouble("productprice"), rs.getString("productImage"));
                p.setProductId(rs.getString("productid"));

                product = p;
                * */
            }
            pstmt.close();
            rs.close();
        } catch (Exception ex) {
            Logger.getLogger(WmsDB.class.getName()).log(Level.SEVERE, null, ex);
        }
        return product;
    }

    /**
     * Metodo que permite registrar un nuevo producto en la base de datos.
     * 
     * @param pd Es el producto que se agregara a la base de datos.
     * 
     */
    public void createNewProduct(Product pd) {
        Statement stmt = null;
        try {
            Class.forName("org.postgresql.Driver");
            getConnection();
            c.setAutoCommit(false);
            stmt = c.createStatement();
            /**
            String sql = "INSERT INTO product (productid,productname,productdescription,productprice,productuser,productauction,productImage) "
                    + "VALUES ('" + pd.getProductId() + "','" + pd.getProductName() + "','" + pd.getProductDescription()
                    + "','" + pd.getProductPrice() + "','" + pd.getProductUser() + "',null,'" + pd.getProductImage()
                    + "');";
            stmt.executeUpdate(sql);
            * **/
            stmt.close();
            c.commit();
            c.close();
        } catch (Exception ex) {
            Logger.getLogger(WmsDB.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    /**
     * Metodo que edita un producto asociado al usuario.
     * 
     * @param productId Id del producto
     * @param pd        Es el producto.
     */
    public void editProductById(String productId, Product pd) {
        Statement stmt = null;
        try {
            Class.forName("org.postgresql.Driver");
            getConnection();
            c.setAutoCommit(false);
            /**
            String sql1 = "UPDATE product SET productname = '" + pd.getProductName() + "', productdescription = '"
                    + pd.getProductDescription() + "' , productprice = '" + pd.getProductPrice()
                    + "' , productImage = '" + pd.getProductImage() + "' WHERE productid = '" + productId + "' ";
            stmt = c.createStatement();
            stmt.executeUpdate(sql1);
            * */
            c.commit();
            c.close();
        } catch (Exception ex) {
            Logger.getLogger(WmsDB.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    /**
     * Metodo que elimina un producto asociado al usuario.
     * 
     * @param id     Id del producto
     * @param idUser Id del usuario.
     */
    public void deleteProductByIdOfUserNickname(String id, String idUser) {
        Statement stmt = null;
        try {
            Class.forName("org.postgresql.Driver");
            getConnection();
            c.setAutoCommit(false);
            String sql1 = "DELETE FROM product WHERE productuser = '" + idUser + "' AND productid = '" + id + "'";
            stmt = c.createStatement();
            stmt.executeUpdate(sql1);
            c.commit();
            c.close();
        } catch (Exception ex) {
            Logger.getLogger(WmsDB.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    /**
     * Metodo que elimina todos los productos cuando un usuario es eliminado.
     * 
     * @param idUser Es el id del usuario
     */
    private void deleteAllProductByIdOfUserNickname(String idUser) {
        Statement stmt = null;
        try {
            Class.forName("org.postgresql.Driver");
            getConnection();
            c.setAutoCommit(false);
            String sql1 = "DELETE FROM product WHERE productuser = '" + idUser + "'";
            stmt = c.createStatement();
            stmt.executeUpdate(sql1);
            c.commit();
            c.close();
        } catch (Exception ex) {
            Logger.getLogger(WmsDB.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

}