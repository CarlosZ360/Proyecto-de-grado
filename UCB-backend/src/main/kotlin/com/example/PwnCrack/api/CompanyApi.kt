package com.example.PwnCrack.api

import com.example.PwnCrack.bl.ClientBl
import com.example.PwnCrack.bl.CompanyBl
import com.example.PwnCrack.dao.repository.CompanyRepository
import com.example.PwnCrack.dto.CompanyDto
import com.example.PwnCrack.dto.ResponseDto
import com.example.PwnCrack.util.AuthUtil
import org.springframework.beans.factory.annotation.Autowired
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.*
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.bind.annotation.RequestMapping


@RestController
@RequestMapping("/api/")
class CompanyApi @Autowired constructor(
        private val companyBl: CompanyBl,
        private val authUtil: AuthUtil
    ){
    //Logger
    companion object {
        val LOGGER: Logger = LoggerFactory.getLogger(CompanyApi::class.java)
    }
    //==============================================================
    // COMPAÑIA
    /**
     * Endpoint POST para crear una compañia
     * @param-companyDto
     * @return ResponseDto<Long>
     */
    @PostMapping("/company")
    fun createCompany(@RequestHeader headers: Map<String, String>, @RequestBody companyDto: CompanyDto): ResponseDto<Long> {
        LOGGER.info("API - Iniciando creación de compañia")
        return try {
            val role = authUtil.getRole(authUtil.getTokenFromHeader(headers))
            if(role == "ADMINISTRADOR") {
                // Se crea la compañia
                val companyId = companyBl.createCompany(companyDto)
                LOGGER.info("API - Compañia creada con exito")
                ResponseDto(data = companyId,
                        message = "Compañia creada con exito",
                        success = true)
            } else {
                LOGGER.error("API - Error al crear la compañia")
                ResponseDto(data = null, message = "Error al crear la compañia, no tiene permisos", success = false)
            }
        } catch (e: Exception) {
            LOGGER.error("API - Error al crear la compañia")
            ResponseDto(data = null, message = "Error al crear la compañia", success = false)
        }
    }
    /**
     * Endpoint GET para obtener una compañia por su id
     * @param-companyId
     * @return ResponseDto<CompanyDto>
     */
    @GetMapping("/company/{companyId}")
    fun getCompanyById(@RequestHeader headers: Map<String, String>, @PathVariable companyId: Long): ResponseDto<CompanyDto> {
        LOGGER.info("API - Iniciando obtención de compañia por su id")
        return try {
            val role = authUtil.getRole(authUtil.getTokenFromHeader(headers))
            if(role == "ADMINISTRADOR" || role == "CONSULTOR" || role == "CLIENTE") {
                // Se obtiene la compañia
                val company = companyBl.getCompanyById(companyId)
                LOGGER.info("API - Compañia obtenida con exito")
                ResponseDto(data = company,
                        message = "Compañia obtenida con exito",
                        success = true)
            } else {
                LOGGER.error("API - Error al obtener la compañia")
                ResponseDto(data = null, message = "Error al obtener la compañia, no tiene permisos", success = false)
            }
        } catch (e: Exception) {
            LOGGER.error("API - Error al obtener la compañia")
            ResponseDto(data = null, message = "Error al obtener la compañia", success = false)
        }
    }
    /**
     * Endpoint PUT para actualizar una compañia
     * @param-companyDto
     * @return ResponseDto<CompanyDto>
     */
    @PutMapping("/company/{companyId}")
    fun updateCompany(@RequestHeader headers: Map<String, String>, @PathVariable companyId: Long, @RequestBody companyDto: CompanyDto): ResponseDto<String> {
        LOGGER.info("API - Iniciando actualización de compañia")
        return try {
            val role = authUtil.getRole(authUtil.getTokenFromHeader(headers))
            if(role == "ADMINISTRADOR") {
                // Se actualiza la compañia
                val data = companyBl.updateCompany(companyId, companyDto)
                LOGGER.info("API - Compañia actualizada con exito")
                ResponseDto(data = data,
                        message = "Compañia actualizada con exito",
                        success = true)
            } else {
                LOGGER.error("API - Error al actualizar la compañia")
                ResponseDto(data = null, message = "Error al actualizar la compañia, no tiene permisos", success = false)
            }
        } catch (e: Exception) {
            LOGGER.error("API - Error al actualizar la compañia")
            ResponseDto(data = null, message = "Error al actualizar la compañia", success = false)
        }
    }
    /**
     * Endpoint DELETE para eliminar una compañia
     * @param-companyId
     * @return ResponseDto<String>
     */
    @DeleteMapping("/company/{companyId}")
    fun deleteCompany(@RequestHeader headers: Map<String, String>, @PathVariable companyId: Long): ResponseDto<String> {
        LOGGER.info("API - Iniciando eliminación de compañia")
        return try {
            val role = authUtil.getRole(authUtil.getTokenFromHeader(headers))
            if(role == "ADMINISTRADOR") {
                // Se elimina la compañia
                val data = companyBl.deleteCompany(companyId)
                LOGGER.info("API - Compañia eliminada con exito")
                ResponseDto(data = data,
                        message = "Compañia eliminada con exito",
                        success = true)
            } else {
                LOGGER.error("API - Error al eliminar la compañia")
                ResponseDto(data = null, message = "Error al eliminar la compañia, no tiene permisos", success = false)
            }
        } catch (e: Exception) {
            LOGGER.error("API - Error al eliminar la compañia")
            ResponseDto(data = null, message = "Error al eliminar la compañia", success = false)
        }
    }
    /**
     * Endpoint GET para obtener todas las compañias
     * @return ResponseDto<List<CompanyDto>>
     */
    @GetMapping("/companies/all")
    fun getAllCompanies(@RequestHeader headers: Map<String, String>): ResponseDto<List<CompanyDto>> {
        LOGGER.info("API - Iniciando obtención de todas las compañias")
        return try {
            val role = authUtil.getRole(authUtil.getTokenFromHeader(headers))
            if(role == "ADMINISTRADOR" || role == "CONSULTOR") {
                // Se obtienen todas las compañias
                val companies = companyBl.getAllCompanies()
                LOGGER.info("API - Compañias obtenidas con exito")
                ResponseDto(data = companies,
                        message = "Compañias obtenidas con exito",
                        success = true)
            } else {
                LOGGER.error("API - Error al obtener las compañias")
                ResponseDto(data = null, message = "Error al obtener las compañias, no tiene permisos", success = false)
            }
        } catch (e: Exception) {
            LOGGER.error("API - Error al obtener las compañias")
            ResponseDto(data = null, message = "Error al obtener las compañias", success = false)
        }
    }

    /**
     * Endpoint GET para obtener todas las compañias activas
     * @return ResponseDto<List<CompanyDto>>
     */
    @GetMapping("/companies")
    fun getAllActiveCompanies(@RequestHeader headers: Map<String, String>): ResponseDto<List<CompanyDto>> {
        LOGGER.info("API - Iniciando obtención de todas las compañias activas")
        return try {
            val role = authUtil.getRole(authUtil.getTokenFromHeader(headers))
            if(role == "ADMINISTRADOR" || role == "CONSULTOR") {
                // Se obtienen todas las compañias activas
                val companies = companyBl.getAllCompaniesActive()
                LOGGER.info("API - Compañias activas obtenidas con exito")
                ResponseDto(data = companies,
                        message = "Compañias activas obtenidas con exito",
                        success = true)
            } else {
                LOGGER.error("API - Error al obtener las compañias activas")
                ResponseDto(data = null, message = "Error al obtener las compañias activas, no tiene permisos", success = false)
            }
        } catch (e: Exception) {
            LOGGER.error("API - Error al obtener las compañias activas")
            ResponseDto(data = null, message = "Error al obtener las compañias activas", success = false)
        }
    }
}
