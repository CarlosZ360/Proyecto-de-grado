package com.example.PwnCrack.dao
import javax.persistence.*

@Entity
@Table(name = "company")
@SequenceGenerator(name = "seq_company", sequenceName = "seq_company", allocationSize = 1, initialValue = 1)
class Company (
        @Column(name="name", nullable = false, length = 150)
        var name: String,
        @Column(name="abrevation", nullable = false, length = 150)
        var abrevation: String,
        @Column(name="state", nullable = false)
        var state: Boolean,
        @Id
        @GeneratedValue(strategy = javax.persistence.GenerationType.SEQUENCE, generator = "seq_company")
        @Column(name = "company_id")
        var companyId: Long = 0
)
{
    constructor(): this("","",true)
}