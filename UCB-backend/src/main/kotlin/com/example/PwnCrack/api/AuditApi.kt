package com.example.PwnCrack.api

import com.example.PwnCrack.bl.AuditBl
import com.example.PwnCrack.dto.AuditDto
import com.example.PwnCrack.dto.AuditListDto
import com.example.PwnCrack.dto.ResponseDto
import com.example.PwnCrack.util.AuthUtil
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/")
class AuditApi @Autowired constructor(
        private val auditService: AuditBl,
        private val authUtil: AuthUtil
){
    //Logger
    companion object {
        val LOGGER: Logger = LoggerFactory.getLogger(AuditApi::class.java)
    }
    //==============================================================
    // AUDITORIA
    /**
     * Endpoint POST para crear una auditoria
     * @param-auditDto
     * @return ResponseDto<Long>
     */
    @PostMapping("/audit")
    fun createAudit(@RequestHeader headers: Map<String, String>, @RequestBody auditDto: AuditDto): ResponseDto<Long> {
        LOGGER.info("API - Iniciando creación de auditoria")
        return try {
            val role = authUtil.getRole(authUtil.getTokenFromHeader(headers))
            if(role == "ADMINISTRADOR") {
                    // Se crea la auditoria
                    // Se separa el arreglo de empleados de la auditoria
                    val auditId = auditService.createAudit(auditDto, auditDto.employeeIds)
                    LOGGER.info("API - Auditoria creada con exito")
                    ResponseDto(data = auditId,
                            message = "Auditoria creada con exito",
                            success = true)
            } else {
                LOGGER.error("API - Error al crear la auditoria")
                ResponseDto(data = null, message = "Error al crear la auditoria, no tiene permisos", success = false)
            }
        } catch (e: Exception) {
            LOGGER.error("API - Error al crear la auditoria")
            ResponseDto(data = null, message = "Error al crear la auditoria", success = false)
        }
    }
    /**
     * Endpoint GET para obtener una auditoria por su id
     * @param-auditId
     * @return ResponseDto<AuditDto>
     */
    @GetMapping("/audit/{auditId}")
    fun getAuditById(@RequestHeader headers: Map<String, String>, @PathVariable auditId: Long): ResponseDto<AuditDto> {
        LOGGER.info("API - Iniciando obtención de auditoria por su id")
        return try {
            val role = authUtil.getRole(authUtil.getTokenFromHeader(headers))
            if(role == "ADMINISTRADOR" || role == "CONSULTOR") {
                // Se obtiene la auditoria
                val audit = auditService.getAuditById(auditId)
                LOGGER.info("API - Auditoria obtenida con exito")
                ResponseDto(data = audit,
                        message = "Auditoria obtenida con exito",
                        success = true)
            } else {
                LOGGER.error("API - Error al obtener la auditoria")
                ResponseDto(data = null, message = "Error al obtener la auditoria, no tiene permisos", success = false)
            }
        } catch (e: Exception) {
            LOGGER.error("API - Error al obtener la auditoria")
            ResponseDto(data = null, message = "Error al obtener la auditoria", success = false)
        }
    }

    /**
     * Endpoint GET para obtener todas las auditorias por companyId
     * @param-clientId
     * @return ResponseDto<List<AuditListDto>>
     */
    @GetMapping("/audit/company/{companyId}")
    fun getAuditsByCompanyId(@RequestHeader headers: Map<String, String>, @PathVariable companyId: Long): ResponseDto<List<AuditListDto>> {
        LOGGER.info("API - Iniciando obtención de auditorias por companyId")
        return try {
            val role = authUtil.getRole(authUtil.getTokenFromHeader(headers))
            if(role == "ADMINISTRADOR" || role == "CONSULTOR" || role == "CLIENTE") {
                // Se obtienen las auditorias
                val audits = auditService.getActiveAuditsByClientId(companyId)
                LOGGER.info("API - Auditorias obtenidas con exito")
                ResponseDto(data = audits,
                        message = "Auditorias obtenidas con exito",
                        success = true)
            } else {
                LOGGER.error("API - Error al obtener las auditorias")
                ResponseDto(data = null, message = "Error al obtener las auditorias, no tiene permisos", success = false)
            }
        } catch (e: Exception) {
            LOGGER.error("API - Error al obtener las auditorias")
            ResponseDto(data = null, message = "Error al obtener las auditorias", success = false)
        }
    }

    /**
     * Endpoint GET para obtener todas las auditorias por clientId
     * @param-employeeId
     * @return ResponseDto<List<AuditListDto>>
     */
    @GetMapping("/audit/client/{clientId}")
    fun getAuditsByClientId(@RequestHeader headers: Map<String, String>, @PathVariable clientId: Long): ResponseDto<List<AuditListDto>> {
        LOGGER.info("API - Iniciando obtención de auditorias por clientId")
        return try {
            val role = authUtil.getRole(authUtil.getTokenFromHeader(headers))
            if(role == "ADMINISTRADOR" || role == "CONSULTOR" || role == "CLIENTE") {
                // Se obtienen las auditorias
                val audits = auditService.getAuditsByClientId(clientId)
                LOGGER.info("API - Auditorias obtenidas con exito")
                ResponseDto(data = audits,
                    message = "Auditorias obtenidas con exito",
                    success = true)
            } else {
                LOGGER.error("API - Error al obtener las auditorias")
                ResponseDto(data = null, message = "Error al obtener las auditorias, no tiene permisos", success = false)
            }
        } catch (e: Exception) {
            LOGGER.error("API - Error al obtener las auditorias")
            ResponseDto(data = null, message = "Error al obtener las auditorias", success = false)
        }
    }

    /**
     * Endpoint DELETE para eliminar una auditoria por su id
     * @param-auditId
     * @return ResponseDto<String>
     */
    @DeleteMapping("/audit/{auditId}")
    fun deleteAudit(@RequestHeader headers: Map<String, String>, @PathVariable auditId: Long): ResponseDto<String> {
        LOGGER.info("API - Iniciando eliminación de auditoria por su id")
        return try {
            val role = authUtil.getRole(authUtil.getTokenFromHeader(headers))
            if(role == "ADMINISTRADOR") {
                // Se elimina la auditoria
                val message = auditService.deleteAudit(auditId)
                LOGGER.info("API - Auditoria eliminada con exito")
                ResponseDto(data = message,
                        message = "Auditoria eliminada con exito",
                        success = true)
            } else {
                LOGGER.error("API - Error al eliminar la auditoria")
                ResponseDto(data = null, message = "Error al eliminar la auditoria, no tiene permisos", success = false)
            }
        } catch (e: Exception) {
            LOGGER.error("API - Error al eliminar la auditoria")
            ResponseDto(data = null, message = "Error al eliminar la auditoria", success = false)
        }
    }
    /**
     * Endpoint PUT para actualizar una auditoria
     * @param-auditDto
     * @return ResponseDto<String>
     */
    @PutMapping("/audit/{auditId}")
    fun updateAudit(@RequestHeader headers: Map<String, String>, @PathVariable auditId: Long, @RequestBody auditDto: AuditDto): ResponseDto<String> {
        LOGGER.info("API - Iniciando actualización de auditoria")
        return try {
            val role = authUtil.getRole(authUtil.getTokenFromHeader(headers))
            if(role == "ADMINISTRADOR") {
                // Se actualiza la auditoria
                val message = auditService.updateAudit(auditId, auditDto, auditDto.employeeIds)
                LOGGER.info("API - Auditoria actualizada con exito")
                ResponseDto(data = message,
                        message = "Auditoria actualizada con exito",
                        success = true)
            } else {
                LOGGER.error("API - Error al actualizar la auditoria")
                ResponseDto(data = null, message = "Error al actualizar la auditoria, no tiene permisos", success = false)
            }
        } catch (e: Exception) {
            LOGGER.error("API - Error al actualizar la auditoria")
            ResponseDto(data = null, message = "Error al actualizar la auditoria", success = false)
        }
    }
}