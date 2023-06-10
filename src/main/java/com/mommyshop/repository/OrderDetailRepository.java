package com.mommyshop.repository;

import com.mommyshop.entity.OrderDetail;
import com.mommyshop.entity.Report;
import com.mommyshop.entity.ReportMonth;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import javax.transaction.Transactional;
import java.util.List;

public interface OrderDetailRepository extends JpaRepository<OrderDetail, Integer> {

	@Query("SELECT o FROM OrderDetail o WHERE o.order.id = ?1")
	List<OrderDetail> getListOrderId(Integer id);

	@Transactional
	@Modifying
	@Query("DELETE  FROM OrderDetail o WHERE o.order.id = :id")
	void deleteAllByOrderId(@Param("id") Integer id);

	@Query("SELECT new Report(o.product.category.parentCategory.name,sum(o.price*o.quantity),count(o.quantity)) "
			+ " FROM OrderDetail o "
			+ " WHERE MONTH(o.order.createDate) like '%' || :date || '%' AND  o.order.orderStatus  IN('FINISHED','RATED')"
			+ " GROUP BY o.product.category.parentCategory.name" + " ORDER BY sum(o.price*o.quantity) DESC")
	List<Report> getInventory(@Param("date") String date);

	@Query("SELECT new Report(o.product.category.name,sum(o.price*o.quantity),count(o.quantity)) "
			+ " FROM OrderDetail o "
			+ " WHERE o.product.category.parentCategory.id =:parentId AND MONTH(o.order.createDate) like '%' || :date || '%' AND o.order.orderStatus  IN('FINISHED','RATED')"
			+ " GROUP BY o.product.category.name" + " ORDER BY sum(o.price*o.quantity) DESC")
	List<Report> getInventoryByParentCategory(@Param("parentId") Integer id, @Param("date") String date);

	@Query("SELECT new Report(o.product.name,sum(o.price*o.quantity),count(o.quantity)) " + " FROM OrderDetail o "
			+ " WHERE o.product.category.id =:Id AND MONTH(o.order.createDate) like '%' || :date || '%' AND o.order.orderStatus  IN('FINISHED','RATED')"
			+ " GROUP BY o.product.name" + " ORDER BY sum(o.price*o.quantity) DESC")
	List<Report> getInventoryByCategory(@Param("Id") Integer id, @Param("date") String date);

	@Query("SELECT new Report(o.account.fullname,sum(d.price*d.quantity),count(DISTINCT o)) "
			+ " FROM Order o join o.orderDetails d" + " GROUP BY o.account.fullname"
			+ " ORDER BY sum(d.price*d.quantity) DESC")
	List<Report> getInventoryByCustomer();

	@Query("SELECT new ReportMonth(MONTH(o.order.createDate),YEAR(o.order.createDate),sum(o.price*o.quantity),count(o),o.product.brand.name) "
			+ " FROM OrderDetail o " + " WHERE o.product.brand.name=:name" + " and o.order.orderStatus  IN('FINISHED','RATED')"
			+ " GROUP BY MONTH(o.order.createDate),YEAR(o.order.createDate)" + " ORDER BY sum(o.price*o.quantity) DESC")
	List<ReportMonth> getInventoryBrandByMonth(@Param("name") String name);

	@Query("SELECT new ReportMonth(MONTH(o.order.createDate),YEAR(o.order.createDate),sum(o.price*o.quantity),count(o),o.product.brand.name) "
			+ " FROM OrderDetail o " + " WHERE o.order.orderStatus  IN('FINISHED','RATED')"
			+ " GROUP BY MONTH(o.order.createDate),YEAR(o.order.createDate)" + " ORDER BY  o.order.createDate ASC ")
	List<ReportMonth> getByMonth();

	@Query("SELECT new ReportMonth(o.product.brand.id,o.product.brand.id,sum(o.price*o.quantity),count(o),o.product.brand.name) "
			+ " FROM OrderDetail o " + "WHERE o.order.orderStatus IN('FINISHED','RATED')" + " GROUP BY  o.product.brand.name"
			+ " ORDER BY sum(o.price*o.quantity) DESC")
	List<ReportMonth> getInventoryBrand();

	@Query("SELECT new ReportMonth(MONTH(o.order.createDate),YEAR(o.order.createDate),sum(o.price*o.quantity),count(o),o.product.brand.name) "
			+ " FROM OrderDetail o "
			+ " WHERE o.product.brand.name=:name and  MONTH(o.order.createDate)=:month and YEAR(o.order.createDate)=:year AND o.order.orderStatus  IN('FINISHED','RATED')")
	List<ReportMonth> getInventoryBrandByMonthAndByBrandName(@Param("name") String name, @Param("month") Integer month,
			@Param("year") Integer year);

	@Query("SELECT new ReportMonth(o.product.id,o.product.brand.id,sum(o.price*o.quantity),count(o),o.product.name) "
			+ " FROM OrderDetail o " + "WHERE  o.order.orderStatus  IN('FINISHED','RATED')" + " GROUP BY  o.product.name"
			+ " ORDER BY sum(o.price*o.quantity) DESC")
	List<ReportMonth> getInventoryProduct();

	@Query("SELECT new ReportMonth(MONTH(o.order.createDate),YEAR(o.order.createDate),sum(o.price*o.quantity),count(o),o.product.name) "
			+ " FROM OrderDetail o "
			+ " WHERE o.product.id=:id and  MONTH(o.order.createDate)=:month and YEAR(o.order.createDate)=:year AND o.order.orderStatus  IN('FINISHED','RATED')")
	List<ReportMonth> getInventoryProductByMonthAndByProductName(@Param("id") Integer id, @Param("month") Integer month,
			@Param("year") Integer year);

	@Query("SELECT new ReportMonth(o.order.id,o.order.id,sum(o.price*o.quantity),count(DISTINCT o.order),o.product.name) "
			+ " FROM OrderDetail o " + " WHERE o.order.orderStatus IN('FINISHED','RATED')"
			+ " ORDER BY sum(o.price*o.quantity) DESC")
	List<ReportMonth> getRevenue();
	
	@Query("SELECT new ReportMonth(o.order.id,o.order.id,sum(o.price*o.quantity),count(DISTINCT o.order),o.product.name) "
			+ " FROM OrderDetail o " 
			+ " ORDER BY sum(o.price*o.quantity) DESC")
	List<ReportMonth> getRevenueAll();

	@Query("SELECT SUM(od.price * od.quantity) FROM OrderDetail od WHERE od.order.id = ?1")
	Float totalPrice(Integer id);

}
