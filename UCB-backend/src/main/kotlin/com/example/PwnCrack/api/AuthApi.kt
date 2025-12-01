package com.example.PwnCrack.api

import com.example.PwnCrack.dto.ResponseDto
import com.example.PwnCrack.dto.AuthReqDto
import com.example.PwnCrack.dto.AuthResDto
import com.example.PwnCrack.bl.SecurityBl
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*


@RestController
@RequestMapping("/api/")
class AuthApi @Autowired constructor(
        private val securityBl: SecurityBl
) {

    // Logger
    companion object {
        private val LOGGER: Logger = LoggerFactory.getLogger(AuthApi::class.java)
    }

    /**
     * Endpoint POST para realizar la autenticacion de un usuario
     * @param authReqDto
     * @return ResponseDto<AuthResDto>
     */
    @PostMapping("/auth")
    fun authentication(@RequestBody authReqDto: AuthReqDto): ResponseDto<AuthResDto> {
        var responseDto: ResponseDto<AuthResDto>
        if(authReqDto.email !="" && authReqDto.password !="") {
            LOGGER.info("Inicio de autenticacion para el usuario con correo ${authReqDto.email}")
            try {
                val authResDto = securityBl.authenticateUser(authReqDto)
                responseDto = ResponseDto(
                        success = true,
                        message = "Autenticacion exitosa",
                        data = authResDto
                )
                LOGGER.info("Autenticacion exitosa")
            }catch (e: Exception) {

                responseDto = ResponseDto(
                        success = false,
                        message = "Error al autenticar",
                        data = null
                )
                LOGGER.error("Error: ${e.message}")
            }
        } else {
            responseDto = ResponseDto(
                    success = false,
                    message = "Los datos de autenticacion son incorrectos",
                    data = null
            )
            LOGGER.info("Los datos de autenticacion son incorrectos")
        }
        return responseDto
    }
}