package com.example.PwnCrack.api

import com.example.PwnCrack.bl.EmployeeBl
import com.example.PwnCrack.dto.EmployeeDto
import com.example.PwnCrack.dto.ResponseDto
import com.example.PwnCrack.util.AuthUtil
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/")
class EmployeeApi @Autowired constructor(
        private val employeeService: EmployeeBl,
        private val authUtil: AuthUtil
){
    //Logger
    companion object {
        val LOGGER: Logger = LoggerFactory.getLogger(EmployeeApi::class.java)
    }
    //==============================================================
    // EMPLEADO
    /**
     * Endpoint POST para crear un empleado
     * @param-employeeDto
     * @return ResponseDto<Long>
     */
    @PostMapping("/employee")
    fun createEmployee(@RequestHeader headers: Map<String, String>, @RequestBody employeeDto: EmployeeDto): ResponseDto<Long> {
        LOGGER.info("API - Iniciando creación de empleado")
        return try {
            val role = authUtil.getRole(authUtil.getTokenFromHeader(headers))
            if(role == "ADMINISTRADOR") {
                // Se crea el empleado
                val employeeId = employeeService.createEmployee(employeeDto)
                LOGGER.info("API - Empleado creado con exito")
                ResponseDto(data = employeeId,
                        message = "Empleado creado con exito",
                        success = true)
            } else {
                LOGGER.error("API - Error al crear el empleado")
                ResponseDto(data = null, message = "Error al crear el empleado, no tiene permisos", success = false)
            }
        } catch (e: Exception) {
            LOGGER.error("API - Error al crear el empleado")
            ResponseDto(data = null, message = "Error al crear el empleado, correo existente", success = false)
        }
    }

    /**
     * Endpoint GET para obtener un empleado por su id
     * @param-employeeId
     * @return ResponseDto<EmployeeDto>
     */
    @GetMapping("/employee/{employeeId}")
    fun getEmployeeById(@RequestHeader headers: Map<String, String>, @PathVariable employeeId: Long): ResponseDto<EmployeeDto> {
        LOGGER.info("API - Iniciando obtención de empleado por id")
        return try {
            val role = authUtil.getRole(authUtil.getTokenFromHeader(headers))
            if(role == "ADMINISTRADOR" || role == "CONSULTOR") {
                // Se obtiene el empleado
                val employee = employeeService.getEmployeeById(employeeId)
                LOGGER.info("API - Empleado obtenido con exito")
                ResponseDto(data = employee,
                        message = "Empleado obtenido con exito",
                        success = true)
            } else {
                LOGGER.error("API - Error al obtener el empleado")
                ResponseDto(data = null, message = "Error al obtener el empleado", success = false)
            }
        } catch (e: Exception) {
            LOGGER.error("API - Error al obtener el empleado")
            ResponseDto(data = null, message = "Error al obtener el empleado", success = false)
        }
    }
    /**
     * Endpoint PUT para actualizar un empleado
     * @param-employeeDto
     * @return ResponseDto<Long>
     */
    @PutMapping("/employee/{employeeId}")
    fun updateEmployee(@RequestHeader headers: Map<String, String>, @PathVariable employeeId: Long, @RequestBody employeeDto: EmployeeDto): ResponseDto<String> {
        LOGGER.info("API - Iniciando actualización de empleado")
        return try {
            val role = authUtil.getRole(authUtil.getTokenFromHeader(headers))
            if(role == "ADMINISTRADOR" || role == "CONSULTOR") {
                // Se actualiza el empleado
                val data = employeeService.updateEmployee(employeeId, employeeDto)
                LOGGER.info("API - Empleado actualizado con exito")
                ResponseDto(data = data,
                        message = "Empleado actualizado con exito",
                        success = true)
            } else {
                LOGGER.error("API - Error al actualizar el empleado")
                ResponseDto(data = null, message = "Error al actualizar el empleado", success = false)
            }
        } catch (e: Exception) {
            LOGGER.error("API - Error al actualizar el empleado")
            ResponseDto(data = null, message = "Error al actualizar el empleado", success = false)
        }
    }

    /**
     * Endpoint DELETE para eliminar un empleado
     * @param-employeeId
     * @return ResponseDto<String>
     */
    @DeleteMapping("/employee/{employeeId}")
    fun deleteEmployee(@RequestHeader headers: Map<String, String>, @PathVariable employeeId: Long): ResponseDto<String> {
        LOGGER.info("API - Iniciando eliminación de empleado")
        return try {
            val role = authUtil.getRole(authUtil.getTokenFromHeader(headers))
            if(role == "ADMINISTRADOR") {
                // Se elimina el empleado
                val data = employeeService.deleteEmployee(employeeId)
                LOGGER.info("API - Empleado eliminado con exito")
                ResponseDto(data = data,
                        message = "Empleado eliminado con exito",
                        success = true)
            } else {
                LOGGER.error("API - Error al eliminar el empleado, no tiene permisos")
                ResponseDto(data = null, message = "Error al eliminar el empleado, no tiene permisos", success = false)
            }
        } catch (e: Exception) {
            LOGGER.error("API - Error al eliminar el empleado")
            ResponseDto(data = null, message = "Error al eliminar el empleado", success = false)
        }
    }
    /**
     * Endpoint GET para obtener todos los empleados-activos
     * @return ResponseDto<List<EmployeeDto>>
     */
    @GetMapping("/employee")
    fun getAllEmployees(@RequestHeader headers: Map<String, String>): ResponseDto<List<EmployeeDto>> {
        LOGGER.info("API - Iniciando obtención de todos los empleados")
        return try {
            val role = authUtil.getRole(authUtil.getTokenFromHeader(headers))
            if(role == "ADMINISTRADOR") {
                // Se obtienen los empleados
                val employees = employeeService.getAllEmployees()
                LOGGER.info("API - Empleados obtenidos con exito")
                ResponseDto(data = employees,
                        message = "Empleados obtenidos con exito",
                        success = true)
            } else {
                LOGGER.error("API - Error al obtener los empleados, no tiene permisos")
                ResponseDto(data = null, message = "Error al obtener los empleados, no tiene permisos", success = false)
            }
        } catch (e: Exception) {
            LOGGER.error("API - Error al obtener los empleados")
            ResponseDto(data = null, message = "Error al obtener los empleados", success = false)
        }
    }
    /**
     * Endpoint GET para obtener todos los empleados con rol CONSULTOR
     * @return ResponseDto<List<EmployeeDto>>
     */
    @GetMapping("/employee/consultor")
    fun getAllConsultorEmployees(@RequestHeader headers: Map<String, String>): ResponseDto<List<EmployeeDto>> {
        LOGGER.info("API - Iniciando obtención de todos los empleados con rol CONSULTOR")
        return try {
            val role = authUtil.getRole(authUtil.getTokenFromHeader(headers))
            if(role == "ADMINISTRADOR") {
                // Se obtienen los empleados
                val employees = employeeService.getAllConsultants()
                LOGGER.info("API - Empleados obtenidos con exito")
                ResponseDto(data = employees,
                        message = "Empleados obtenidos con exito",
                        success = true)
            } else {
                LOGGER.error("API - Error al obtener los empleados")
                ResponseDto(data = null, message = "Error al obtener los empleados, no tiene permisos", success = false)
            }
        } catch (e: Exception) {
            LOGGER.error("API - Error al obtener los empleados")
            ResponseDto(data = null, message = "Error al obtener los empleados", success = false)
        }
    }
    /**
     * Endpoint PUT para actualizar la contraseña por medio del correo del empleado
     * @param-email
     * @param-password
     * @return ResponseDto<String>
     */
    @PutMapping("/employee/password")
    fun updatePasswordByEmail(@RequestHeader headers: Map<String, String>, @RequestParam email: String, @RequestParam password: String): ResponseDto<String> {
        LOGGER.info("API - Iniciando actualización de contraseña por medio del correo del empleado")
        return try {
            val role = authUtil.getRole(authUtil.getTokenFromHeader(headers))
            if(role == "ADMINISTRADOR" || role == "CONSULTOR") {
                // Se actualiza la contraseña
                val data = employeeService.updatePasswordByEmail(email, password)
                LOGGER.info("API - Contraseña actualizada con exito")
                ResponseDto(data = data,
                        message = "Contraseña actualizada con exito",
                        success = true)
            } else {
                LOGGER.error("API - Error al actualizar la contraseña")
                ResponseDto(data = null, message = "Error al actualizar la contraseña, no tiene permisos", success = false)
            }
        } catch (e: Exception) {
            LOGGER.error("API - Error al actualizar la contraseña")
            ResponseDto(data = null, message = "Error al actualizar la contraseña", success = false)
        }
    }

}