package com.example.PwnCrack.dao

import javax.persistence.*
@Entity
@Table(name = "employee")
@SequenceGenerator(name = "seq_employee", sequenceName = "seq_employee", allocationSize = 1, initialValue = 1)
class Employee (
        @Column(name="name", nullable = false, length = 150)
        var name: String,
        @Column(name="last_name", nullable = false, length = 150)
        var lastName: String,
        @Column(name="phone", nullable = false, length = 150)
        var phone: String,
        @Column(name="email", nullable = false, length = 150)
        var email: String,
        @Column(name="role", nullable = false, length = 150)
        var role: String,
        @Column(name="password", nullable = false, length = 150)
        var password: String,
        @Column(name="state", nullable = false)
        var state: Boolean,
        @Id
        @GeneratedValue(strategy = javax.persistence.GenerationType.SEQUENCE, generator = "seq_employee")
        @Column(name = "employee_id")
        var employeeId: Long = 0
)
{
    constructor(): this("","","","","","",true)
}
