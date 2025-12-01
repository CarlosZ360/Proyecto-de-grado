package com.example.PwnCrack.dao

import java.util.*
import javax.persistence.*

@Entity
@Table(name = "audit")
@SequenceGenerator(name = "seq_audit", sequenceName = "seq_audit", allocationSize = 1, initialValue = 1)
class Audit (
        @Column(name="name", nullable = false, length = 150)
        var name: String,
        @Column(name="date", nullable = false)
        var date: Date,
        @Column(name="company_id", nullable = false) //FK
        var companyId: Long,
        @Column(name="state", nullable = false)
        var state: Boolean,
        @Id
        @GeneratedValue(strategy = javax.persistence.GenerationType.SEQUENCE, generator = "seq_audit")
        @Column(name = "audit_id")
        var auditId: Long = 0
)
{
    constructor(): this("",Date(),0,true,0)
}