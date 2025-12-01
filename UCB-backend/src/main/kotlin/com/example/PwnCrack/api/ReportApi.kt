package com.example.PwnCrack.api

import com.example.PwnCrack.bl.ReportBl
import com.example.PwnCrack.dao.ReportFinal
import com.example.PwnCrack.dto.*
import com.example.PwnCrack.util.AuthUtil
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile

@RestController
@RequestMapping("/api/")
class ReportApi @Autowired constructor(
        private val reportService: ReportBl,
        private val authUtil: AuthUtil
){
    //Logger
    companion object {
        val LOGGER: Logger = LoggerFactory.getLogger(EmployeeApi::class.java)
    }
    //==============================================================
    // REPORTE
    /**
     * Endpoint POST para leer un archivo .txt
     * @param-path
     * @return ResponseDto<String>
     */
    @PostMapping("/report", consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    fun readTxtFile(@RequestHeader headers: Map<String, String>, @RequestParam("id") id: Long, @RequestPart("archivo") archivo: MultipartFile): ResponseDto<Long> {
        LOGGER.info("API - Iniciando lectura de archivo .txt")
        return try {
            val role = authUtil.getRole(authUtil.getTokenFromHeader(headers))
            if(role == "ADMINISTRADOR" || role == "CONSULTOR") {
                // Se lee el archivo .txt
                val reportId = reportService.readTxtFile(id, archivo)
                LOGGER.info("API - Archivo .txt leido con exito")
                ResponseDto(data = reportId,
                        message = "Archivo .txt leido con exito",
                        success = true)
                } else {
                    LOGGER.error("API - Error al leer el archivo .txt")
                    ResponseDto(data = null, message = "Error al leer el archivo .txt, no tiene permisos", success = false)
                }
        } catch (e: Exception) {
            LOGGER.error("API - Error al leer el archivo .txt")
            ResponseDto(data = null, message = "Error al leer el archivo .txt", success = false)
        }
    }
    /**
     * Endpoint GET para obtener un reporte por su id
     * @param-reportId
     * @return ResponseDto<String>
     */
    @GetMapping("/report/{reportId}")
    fun getReportById(@RequestHeader headers: Map<String, String>, @PathVariable reportId: Long): ResponseDto<ReportDto> {
        LOGGER.info("API - Iniciando obtención de reporte por su id")
        return try {
            val role = authUtil.getRole(authUtil.getTokenFromHeader(headers))
            if(role == "ADMINISTRADOR" || role == "CONSULTOR" || role == "CLIENTE") {
                // Se obtiene el reporte
                val report = reportService.getReportById(reportId)
                LOGGER.info("API - Reporte obtenido con exito")
                ResponseDto(data = report,
                        message = "Reporte obtenido con exito",
                        success = true)
            } else {
                LOGGER.error("API - Error al obtener el reporte")
                ResponseDto(data = null, message = "Error al obtener el reporte, no tiene permisos", success = false)
            }
        } catch (e: Exception) {
            LOGGER.error("API - Error al obtener el reporte")
            ResponseDto(data = null, message = "Error al obtener el reporte", success = false)
        }
    }
    /**
     * Endpoint GET para obtener todos los reportes de una auditoria
     * @param-auditId
     * @return ResponseDto<List<ReportDto>>
     */
    @GetMapping("/report/audit/{auditId}")
    fun getReportsByAuditId(@RequestHeader headers: Map<String, String>, @PathVariable auditId: Long): ResponseDto<List<ReportListDto>> {
        LOGGER.info("API - Iniciando obtención de reportes por auditId")
        return try {
            val role = authUtil.getRole(authUtil.getTokenFromHeader(headers))
            if(role == "ADMINISTRADOR" || role == "CONSULTOR" || role == "CLIENTE") {
                // Se obtienen los reportes
                val reports = reportService.getReportsByAuditId(auditId)
                LOGGER.info("API - Reportes obtenidos con exito")
                ResponseDto(data = reports,
                        message = "Reportes obtenidos con exito",
                        success = true)
            } else {
                LOGGER.error("API - Error al obtener los reportes")
                ResponseDto(data = null, message = "Error al obtener los reportes, no tiene permisos", success = false)
            }
        } catch (e: Exception) {
            LOGGER.error("API - Error al obtener los reportes")
            ResponseDto(data = null, message = "Error al obtener los reportes", success = false)
        }
    }




    //==============================================================
    // REPORTE-Final
    /**
     * Endpoint POST para leer dos archivos .txt
     * @param-path
     * @return ResponseDto<String>
     */
    @PostMapping("/report/final", consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    fun readTxtFiles(@RequestHeader headers: Map<String, String>, @RequestParam("id") id: Long, @RequestPart("archivo") archivo: MultipartFile, @RequestPart("archivo2") archivo2: MultipartFile, @RequestParam("observation") observation: String): ResponseDto<Long> {
        LOGGER.info("API - Iniciando lectura de archivos .txt")
        return try {
            val role = authUtil.getRole(authUtil.getTokenFromHeader(headers))
            if(role == "ADMINISTRADOR" || role == "CONSULTOR") {
                // Se los archivos .txt
                val reportId = reportService.readTxtFiles(id, archivo, archivo2, observation)
                LOGGER.info("API - Archivos .txt leidos con exito")
                ResponseDto(data = reportId,
                    message = "Archivos .txt leidos con exito",
                    success = true)
            } else {
                LOGGER.error("API - Error al leer los archivos .txt")
                ResponseDto(data = null, message = "Error al leer los archivos .txt, no tiene permisos", success = false)
            }
        } catch (e: Exception) {
            LOGGER.error("API - Error al leer el archivo .txt")
            ResponseDto(data = null, message = "Error al leer el archivo .txt", success = false)
        }
    }
    /**
     * Endpoint GET para obtener un reporte final por su id
     * @param-reportFinalId
     * @return ResponseDto<String>
     */
    @GetMapping("/report/final/{reportFinalId}")
    fun getReportFinalById(@RequestHeader headers: Map<String, String>, @PathVariable reportFinalId: Long): ResponseDto<ReportFinalDto> {
        LOGGER.info("API - Iniciando obtención de reporte final por su id")
        return try {
            val role = authUtil.getRole(authUtil.getTokenFromHeader(headers))
            if(role == "ADMINISTRADOR" || role == "CONSULTOR" || role == "CLIENTE") {
                // Se obtiene el reporte final
                val report = reportService.getReportFinalById(reportFinalId)
                LOGGER.info("API - Reporte final obtenido con exito")
                ResponseDto(data = report,
                    message = "Reporte final obtenido con exito",
                    success = true)
            } else {
                LOGGER.error("API - Error al obtener el reporte final")
                ResponseDto(data = null, message = "Error al obtener el reporte final, no tiene permisos", success = false)
            }
        } catch (e: Exception) {
            LOGGER.error("API - Error al obtener el reporte final")
            ResponseDto(data = null, message = "Error al obtener el reporte final", success = false)
        }
    }
    /**
     * Endpoint GET para obtener todos los reportes finales de un reporte
     * @param-reportId
     * @return ResponseDto<List<ReportFinalDto>>
     */
    @GetMapping("/report/final/report/{reportId}")
    fun getReportFinalsByReportId(@RequestHeader headers: Map<String, String>, @PathVariable reportId: Long): ResponseDto<List<ReportListFinalDto>> {
        LOGGER.info("API - Iniciando obtención de reportes finales por reportId")
        return try {
            val role = authUtil.getRole(authUtil.getTokenFromHeader(headers))
            if(role == "ADMINISTRADOR" || role == "CONSULTOR" || role == "CLIENTE") {
                // Se obtienen los reportes finales
                val reports = reportService.getReportsFinalByReportId(reportId)
                LOGGER.info("API - Reportes finales obtenidos con exito")
                ResponseDto(data = reports,
                    message = "Reportes finales obtenidos con exito",
                    success = true)
            } else {
                LOGGER.error("API - Error al obtener los reportes finales")
                ResponseDto(data = null, message = "Error al obtener los reportes finales, no tiene permisos", success = false)
            }
        } catch (e: Exception) {
            LOGGER.error("API - Error al obtener los reportes finales")
            ResponseDto(data = null, message = "Error al obtener los reportes finales", success = false)
        }
    }

    /**
     * Endpoint GET para obtener todos los hashes y clearHash de la base de datos
     * @return ResponseDto<HashFileDto>
     */
    @GetMapping("/hashes")
    fun getHashes(@RequestHeader headers: Map<String, String>): ResponseDto<ByteArray> {
        LOGGER.info("API - Iniciando obtención de hashes y clearHash")
        return try {
            val role = authUtil.getRole(authUtil.getTokenFromHeader(headers))
            if(role == "ADMINISTRADOR") {
                // Se obtienen los hashes y clearHash
                val hashes = reportService.getHashes()
                LOGGER.info("API - Hashes y clearHash obtenidos con exito")
                ResponseDto(data = hashes,
                    message = "Hashes y clearHash obtenidos con exito",
                    success = true)
            } else {
                LOGGER.error("API - Error al obtener los hashes y clearHash")
                ResponseDto(data = null, message = "Error al obtener los hashes y clearHash, no tiene permisos", success = false)
            }
        } catch (e: Exception) {
            LOGGER.error("API - Error al obtener los hashes y clearHash")
            ResponseDto(data = null, message = "Error al obtener los hashes y clearHash", success = false)
        }
    }

    /**
     * Endpoint POST para leer un archivo .txt con hashes y clearHash
     * @param-path
     * @return ResponseDto<String>
     */
    @PostMapping("/hashes", consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    fun readHashesTxtFile(@RequestHeader headers: Map<String, String>, @RequestPart("archivo") archivo: MultipartFile): ResponseDto<String> {
        LOGGER.info("API - Iniciando lectura de archivo .txt con hashes y clearHash")
        return try {
            val role = authUtil.getRole(authUtil.getTokenFromHeader(headers))
            if(role == "ADMINISTRADOR") {
                // Se lee el archivo .txt
                reportService.readFilePotfile(archivo)
                LOGGER.info("API - Archivo .txt leido con exito")
                ResponseDto(data = null,
                    message = "Archivo .txt leido con exito",
                    success = true)
            } else {
                LOGGER.error("API - Error al leer el archivo .txt")
                ResponseDto(data = null, message = "Error al leer el archivo .txt, no tiene permisos", success = false)
            }
        } catch (e: Exception) {
            LOGGER.error("API - Error al leer el archivo .txt")
            ResponseDto(data = null, message = "Error al leer el archivo .txt", success = false)
        }
    }
}