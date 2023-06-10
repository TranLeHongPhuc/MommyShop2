package com.mommyshop.entity;

import com.mommyshop.entity.enums.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

import org.hibernate.annotations.Type;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "order_tracks")
public class OrderTrack {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Enumerated(EnumType.STRING)
    private OrderStatus orderStatus;

    @Column(name = "update_time")
    private Date updateTime = new Date();

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;
    
    @Column(length = 700, columnDefinition = "TEXT")
    @Type(type = "text")
    private String note;
}
