package com.example.PwnCrack.dao
import javax.persistence.*


@Entity
@Table(name = "employee_audit")
@SequenceGenerator(name = "seq_employee_audit", sequenceName = "seq_employee_audit", allocationSize = 1, initialValue = 1)
class EmployeeAudit (
        @Column(name="employee_id", nullable = false) //FK
        var employeeId: Long,
        @Column(name="audit_id", nullable = false) //FK
        var auditId: Long,
        @Column(name="state", nullable = false)
        var state: Boolean,
        @Id
        @GeneratedValue(strategy = javax.persistence.GenerationType.SEQUENCE, generator = "seq_employee_audit")
        @Column(name = "employee_audit_id")
        var employeeAuditId: Long = 0
)
{
    constructor(): this(0,0, true)
}