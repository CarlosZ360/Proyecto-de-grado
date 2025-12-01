package com.example.PwnCrack.bl

import com.example.PwnCrack.dao.Audit
import com.example.PwnCrack.dao.EmployeeAudit
import com.example.PwnCrack.dao.repository.*
import com.example.PwnCrack.dto.AuditDto
import com.example.PwnCrack.dto.AuditEmployee
import com.example.PwnCrack.dto.AuditListDto
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class AuditBl @Autowired constructor(
        private val auditRepository: AuditRepository,
        private val employeeAuditRepository: EmployeeAuditRepository,
        private val employeeRepository: EmployeeRepository,
        private val companyRepository: CompanyRepository,
        private val clientRepository: ClientRepository
){
    //Logger
    companion object {
        val LOGGER: Logger = LoggerFactory.getLogger(AuditBl::class.java)
    }
    //Función para crear una nueva auditoria, recibiendo un objeto de tipo AuditDto y un arreglo de enteros con los ids de los empleados
    fun createAudit(auditDto: AuditDto, employeeIds: List<Long>): Long {
        LOGGER.info("BL - Iniciando logica para crear una auditoria")
        try {
            // Se crea la auditoria
            val audit = Audit()
            audit.name = auditDto.name
            audit.date = auditDto.date
            audit.companyId = auditDto.companyId
            // Se guarda la auditoria
            val auditSaved = auditRepository.save(audit)
            LOGGER.info("BL - Auditoria creada con exito")
            //Ahora guardo los empleados que estan relacionados con la auditoria
            for (employeeId in employeeIds) {
                val employeeAudit = EmployeeAudit()
                employeeAudit.employeeId = employeeId
                employeeAudit.auditId = auditSaved.auditId
                employeeAuditRepository.save(employeeAudit)
            }
            return auditSaved.auditId
        } catch (e: Exception) {
            LOGGER.error("BL - Error al crear la auditoria")
            throw e
        }

    }
    //Función para obtener una auditoria por su id
    fun getAuditById(auditId: Long): AuditDto {
        LOGGER.info("BL - Iniciando logica para obtener una auditoria por su id")

        try {
            // Se obtiene la auditoria
            val audit = auditRepository.findById(auditId)
            if(audit.isPresent){
                LOGGER.info("BL - Auditoria esta presente")
                // Obtener los IDs de los empleados asociados a esta auditoria
                val employeeIds = ArrayList<Long>()
                // Obtener los IDs de los empleados activos asociados a esta auditoria
                //val employeeAudits = employeeAuditRepository.findByAuditId(auditId)
                val employeeAudits = employeeAuditRepository.findByAuditIdAndState(auditId, true)
                employeeAudits.forEach { employeeIds.add(it.employeeId) }

                LOGGER.info("BL - Auditoria obtenida con exito")
                return AuditDto(
                        auditId = audit.get().auditId,
                        name = audit.get().name,
                        date = audit.get().date,
                        companyId = audit.get().companyId,
                        employeeIds = employeeIds,
                        state = audit.get().state
                )
            }else{
                throw Exception("Auditoria no encontrada")
            }
        } catch (e: Exception) {
            LOGGER.error("BL - Error al obtener la auditoria")
            throw e
        }
    }

    //Obtener auditorias - activas por companyId
    fun getActiveAuditsByClientId(clientId: Long): List<AuditListDto> {
        LOGGER.info("BL - Iniciando logica para obtener auditorias activas por clienteId")
        try {
            // Se obtienen las auditorias
            val audits = auditRepository.findByCompanyIdAndState(clientId, true)
            val auditListDto = ArrayList<AuditListDto>()
            audits.forEach {
                // Obtener los IDs, nombres y apellidos de los empleados asociados a esta auditoria
                val employeeInfo = ArrayList<AuditEmployee>()
                val employeeAudits = employeeAuditRepository.findByAuditIdAndState(it.auditId, true)
                employeeAudits.forEach {
                    val employee = employeeRepository.findById(it.employeeId)
                    if (employee.isPresent) {
                        employeeInfo.add(AuditEmployee(
                                employeeId = it.employeeId,
                                name = employee.get().name,
                                lastName = employee.get().lastName,
                                email = employee.get().email
                        ))
                    }
                }

                auditListDto.add(AuditListDto(
                        auditId = it.auditId,
                        name = it.name,
                        date = it.date,
                        companyId = it.companyId,
                        employee = employeeInfo,
                        state = it.state
                ))
            }
            LOGGER.info("BL - Auditorias obtenidas con exito")
            return auditListDto
        } catch (e: Exception) {
            LOGGER.error("BL - Error al obtener las auditorias")
            throw e
        }
    }

    //Funcion para obtener el companyId de un cliente por su id y obtener todas las auditorias de ese cliente
    fun getAuditsByClientId(clientId: Long): List<AuditListDto> {
        LOGGER.info("BL - Iniciando logica para obtener auditorias por clienteId")
        try {
            // Se obtiene el companyId del cliente
            val companyId = clientRepository.findById(clientId).get().companyId
            //Pase de int a long
            val companyIdLong = companyId.toLong()
            // Se obtienen las auditorias activas
            val audits = auditRepository.findByCompanyIdAndState(companyIdLong, true)
            val auditListDto = ArrayList<AuditListDto>()
            audits.forEach {
                // Obtener los IDs, nombres y apellidos de los empleados asociados a esta auditoria
                val employeeInfo = ArrayList<AuditEmployee>()
                val employeeAudits = employeeAuditRepository.findByAuditId(it.auditId)
                employeeAudits.forEach {
                    val employee = employeeRepository.findById(it.employeeId)
                    if (employee.isPresent) {
                        employeeInfo.add(AuditEmployee(
                                employeeId = it.employeeId,
                                name = employee.get().name,
                                lastName = employee.get().lastName,
                                email = employee.get().email
                        ))
                    }
                }

                auditListDto.add(AuditListDto(
                        auditId = it.auditId,
                        name = it.name,
                        date = it.date,
                        companyId = it.companyId,
                        employee = employeeInfo,
                        state = it.state
                ))
            }
            LOGGER.info("BL - Auditorias obtenidas con exito")
            return auditListDto
        } catch (e: Exception) {
            LOGGER.error("BL - Error al obtener las auditorias")
            throw e
        }
    }



    //Función para eliminar una auditoria - eliminado logico
    fun deleteAudit(auditId: Long): String {
        LOGGER.info("BL - Iniciando logica para eliminar una auditoria")
        try {
            // Se obtiene la auditoria
            val audit = auditRepository.findById(auditId)
            if(audit.isPresent){
                // Se elimina la auditoria
                audit.get().state = false
                // Se guarda la auditoria
                auditRepository.save(audit.get())
                LOGGER.info("BL - Auditoria eliminada con exito")
                return "Auditoria eliminada con exito"
            }else{
                LOGGER.error("BL - Error auditoria no existente")
                throw Exception("Auditoria no encontrada")
            }
        } catch (e: Exception) {
            LOGGER.error("BL - Error al eliminar la auditoria")
            throw e
        }
    }

    //Función para actualizar una auditoria
    fun updateAudit(auditId: Long,auditDto: AuditDto, employeeIds: List<Long>): String {
        LOGGER.info("BL - Iniciando logica para actualizar una auditoria")
        try {
            println(auditId)
            // Se obtiene la auditoria
            val audit = auditRepository.findById(auditId)
            println(auditId)
            if(audit.isPresent){
                // Se actualiza la auditoria
                audit.get().name = auditDto.name
                // Mantener la fecha de creacion
                audit.get().date = audit.get().date
                audit.get().companyId = auditDto.companyId
                // Se guarda la auditoria
                println("1")
                auditRepository.save(audit.get())
                println("2")

                // Se eliminan de forma logica los empleados asociados a esta auditoria
                val employeeAudits = employeeAuditRepository.findByAuditId(auditId)
                employeeAudits.forEach {
                    it.state = false
                    employeeAuditRepository.save(it)
                }
                println("3")

                // Se guardan los nuevos empleados asociados a esta auditoria
                for (employeeId in employeeIds) {
                    val employeeAudit = EmployeeAudit()
                    employeeAudit.employeeId = employeeId
                    employeeAudit.auditId = auditId
                    employeeAuditRepository.save(employeeAudit)
                }
                println("4")

                LOGGER.info("BL - Auditoria actualizada con exito")
                return "Auditoria actualizada con exito"
            }else{
                LOGGER.error("BL - Error auditoria no existente")
                throw Exception("Auditoria no encontrada")
            }
        } catch (e: Exception) {
            LOGGER.error("BL - Error al actualizar la auditoria")
            throw e
        }
    }
}