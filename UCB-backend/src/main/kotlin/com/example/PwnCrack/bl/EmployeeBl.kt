package com.example.PwnCrack.bl

import at.favre.lib.crypto.bcrypt.BCrypt
import com.example.PwnCrack.dao.Employee
import com.example.PwnCrack.dao.repository.ClientRepository
import com.example.PwnCrack.dao.repository.EmployeeRepository
import com.example.PwnCrack.dto.EmployeeDto
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service


@Service
class EmployeeBl @Autowired constructor(
        private val employeeRepository: EmployeeRepository,
        private val clientRepository: ClientRepository
){
    //Logger
    companion object {
        val LOGGER: Logger = LoggerFactory.getLogger(EmployeeBl::class.java)
    }

    //Metodo para crear un nuevo empleado
    fun createEmployee(employeeDto: EmployeeDto): Long {
        LOGGER.info("BL - Iniciando logica para crear un empleado")
        try {
            val password: String = BCrypt.withDefaults().hashToString(12, employeeDto.password.toCharArray())

            // Se crea el empleado
            val employee = Employee()
            employee.name = employeeDto.name
            employee.lastName = employeeDto.lastName
            employee.email = employeeDto.email
            employee.phone = employeeDto.phone
            employee.role = employeeDto.role
            employee.password = password
            //Verificar que el correo sea unico en empleados y clientes
            val employeeEmail = employeeRepository.findByEmailAndState(employeeDto.email, true)
            val clientEmail = clientRepository.findByEmailAndState(employeeDto.email, true)
            if(employeeEmail != null || clientEmail != null){
                LOGGER.error("BL - Error al crear el empleado, correo ya existente")
                throw Exception("Correo ya existente")
            }
            // Se guarda el empleado
            val employeeSaved = employeeRepository.save(employee)
            LOGGER.info("BL - Empleado creado con exito")
            return employeeSaved.employeeId
        } catch (e: Exception) {
            LOGGER.error("BL - Error al crear el empleado")
            throw e
        }
    }
    //Metodo para obtener un empleado por su id
    fun getEmployeeById(employeeId: Long): EmployeeDto {
        LOGGER.info("BL - Iniciando logica para obtener un empleado por su id")
        try {
            // Se obtiene el empleado
            val employee = employeeRepository.findById(employeeId)
            if(employee.isPresent){
                LOGGER.info("BL - Empleado obtenido con exito")

                return EmployeeDto(
                        employeeId = employee.get().employeeId,
                        name = employee.get().name,
                        lastName = employee.get().lastName,
                        email = employee.get().email,
                        phone = employee.get().phone,
                        role = employee.get().role,
                        state = employee.get().state,
                        password = employee.get().password
                )
            }else{
                LOGGER.error("BL - Error empleado no existente")
                throw Exception("Empleado no encontrado")
            }
        } catch (e: Exception) {
            LOGGER.error("BL - Error al obtener el empleado")
            throw e
        }
    }
    //Metodo para actualizar un empleado
    fun updateEmployee(employeeId: Long, employeeDto: EmployeeDto): String {
        LOGGER.info("BL - Iniciando logica para actualizar un empleado")
        try {
            //val password: String = BCrypt.withDefaults().hashToString(12, employeeDto.password.toCharArray())

            // Se obtiene el empleado
            val employee = employeeRepository.findById(employeeId)
            if(employee.isPresent){
                // Se actualiza el empleado
                employee.get().name = employeeDto.name
                employee.get().lastName = employeeDto.lastName
                employee.get().email = employeeDto.email
                employee.get().phone = employeeDto.phone
                employee.get().role = employeeDto.role
                employee.get().password = employee.get().password
                // Se guarda el empleado
                employeeRepository.save(employee.get())
                LOGGER.info("BL - Empleado actualizado con exito")
                return "Empleado actualizado con exito"
            }else{
                LOGGER.error("BL - Error empleado no existente")
                throw Exception("Empleado no encontrado")
            }
        } catch (e: Exception) {
            LOGGER.error("BL - Error al actualizar el empleado")
            throw e
        }
    }
    //Metodo para eliminar un empleado - eliminado logico
    fun deleteEmployee(employeeId: Long): String {
        LOGGER.info("BL - Iniciando logica para eliminar un empleado")
        try {
            // Se obtiene el empleado
            val employee = employeeRepository.findById(employeeId)
            if(employee.isPresent){
                // Se elimina el empleado
                employee.get().state = false
                // Se guarda el empleado
                employeeRepository.save(employee.get())
                LOGGER.info("BL - Empleado eliminado con exito")
                return "Empleado eliminado con exito"
            }else{
                LOGGER.error("BL - Error empleado no existente")
                throw Exception("Empleado no encontrado")
            }
        } catch (e: Exception) {
            LOGGER.error("BL - Error al eliminar el empleado")
            throw e
        }
    }
    //Metodo para obtener todos los empleados activos
    fun getAllEmployees(): List<EmployeeDto> {
        LOGGER.info("BL - Iniciando logica para obtener todos los empleados")
        try {
            // Se obtienen los empleados
            val employees = employeeRepository.findAllByState(true)
            val employeesDto = ArrayList<EmployeeDto>()
            employees.forEach {
                employeesDto.add(EmployeeDto(
                        employeeId = it.employeeId,
                        name = it.name,
                        lastName = it.lastName,
                        email = it.email,
                        phone = it.phone,
                        role = it.role,
                        state = it.state,
                        password = it.password
                ))
            }
            return employeesDto
        } catch (e: Exception) {
            LOGGER.error("BL - Error al obtener los empleados")
            throw e
        }
    }
    //Metodo para obtener a todos los empleados con rol CONSULTOR
    fun getAllConsultants(): List<EmployeeDto> {
        LOGGER.info("BL - Iniciando logica para obtener todos los empleados con rol CONSULTOR")
        try {
            // Se obtienen los empleados
            val employees = employeeRepository.findAllByRoleAndState("CONSULTOR", true)
            val employeesDto = ArrayList<EmployeeDto>()
            employees.forEach {
                employeesDto.add(EmployeeDto(
                        employeeId = it.employeeId,
                        name = it.name,
                        lastName = it.lastName,
                        email = it.email,
                        phone = it.phone,
                        role = it.role,
                        state = it.state,
                        password = it.password
                ))
            }
            return employeesDto
        } catch (e: Exception) {
            LOGGER.error("BL - Error al obtener los empleados con rol CONSULTOR")
            throw e
        }
    }
    //Funcion para actualizar el password por medio del correo del empleado
    fun updatePasswordByEmail(email: String, password: String): String {
        LOGGER.info("BL - Iniciando logica para actualizar el password por medio del correo del empleado")
        try {
            val passwordHash: String = BCrypt.withDefaults().hashToString(12, password.toCharArray())
            // Se obtiene el empleado
            val employee = employeeRepository.findByEmailAndState(email, true)
            if(employee != null){
                // Se actualiza el password
                employee.password = passwordHash
                // Se guarda el empleado
                employeeRepository.save(employee)
                LOGGER.info("BL - Password actualizado con exito")
                return "Password actualizado con exito"
            }else{
                LOGGER.error("BL - Error empleado no existente")
                throw Exception("Empleado no encontrado")
            }
        } catch (e: Exception) {
            LOGGER.error("BL - Error al actualizar el password por medio del correo del empleado")
            throw e
        }
    }

}