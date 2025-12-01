package com.example.PwnCrack.bl

import com.example.PwnCrack.dao.repository.ClientRepository
import com.example.PwnCrack.dao.repository.EmployeeRepository
import com.example.PwnCrack.dto.AuthReqDto
import com.example.PwnCrack.dto.AuthResDto
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import at.favre.lib.crypto.bcrypt.BCrypt
import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import com.auth0.jwt.exceptions.JWTCreationException
import java.util.*


@Service
class SecurityBl @Autowired constructor(
        private val clientRepository: ClientRepository,
        private val employeeRepository: EmployeeRepository

){

    companion object {
        val LOGGER: Logger = LoggerFactory.getLogger(SecurityBl::class.java.name)
        const val JWT_SECRET: String = "pwncrack2024"
    }

    /**
     * Este método se encarga de realizar la autenticación de un usuario del sistema
     * la constraseña recibida se compara con su equivalente en BCRYPT presente en la
     * base de datos
     * @param credentials
     * @return AuthResDto
     */
    fun authenticateUser(credentials: AuthReqDto): AuthResDto?{
        var result: AuthResDto? = null
        LOGGER.info("Comenzando proceso de autenticación con: $credentials")
        // Obtener el usuario por su correo
        val persona = employeeRepository.findByEmailAndState(credentials.email, true)
        if(persona!=null){
            val currentPasswordInBCrypt = persona.password
            //println("Se obtuvo la siguiente contraseña de bbdd: $currentPasswordInBCrypt")
            val resultBCrypt: BCrypt.Result = BCrypt.verifyer().verify(credentials.password.toCharArray(), currentPasswordInBCrypt)
            // Verificar si la contraseña coincide
            if (resultBCrypt.verified) {
                //println("La contraseña coincide")
                // Crear el token de autenticación con el usuario y sus roles y un tiempo de expiracion largo
                result = generateTokenJWT(persona.employeeId.toString(), persona.role,30000)
                //println(result)
                LOGGER.info("Se generó el token JWT: $result")
            } else {
                //println("Las contraseñas no coinciden")
                throw Exception("Las contraseñas no coinciden")
            }
        }else{
            val cliente = clientRepository.findByEmailAndState(credentials.email, true)
            if(cliente!=null){
                val currentPasswordInBCrypt = cliente.password
                //println("Se obtuvo la siguiente contraseña de bbdd: $currentPasswordInBCrypt")
                val resultBCrypt: BCrypt.Result = BCrypt.verifyer().verify(credentials.password.toCharArray(), currentPasswordInBCrypt)
                // Verificar si la contraseña coincide
                if (resultBCrypt.verified) {
                    //println("La contraseña coincide")
                    // Crear el token de autenticación con el usuario y sus roles y un tiempo de expiracion largo
                    result = generateTokenJWT(cliente.clientId.toString(), "CLIENTE",30000)
                    //println(result)
                    LOGGER.info("Se generó el token JWT: $result")
                } else {
                    //println("Las contraseñas no coinciden")
                    throw Exception("Las contraseñas no coinciden")

                }
            }else{
                //println("No se encontró el usuario")
                throw Exception("No se encontró el usuario")
            }
        }
        return result
    }


    /**
     * Este método se encarga de generar el token JWT
     * @param subject
     * @param expirationTimeInSeconds
     * @return AuthenticationResponse
     */
    fun generateTokenJWT(subject: String, rol: String, expirationTimeInSeconds: Int): AuthResDto? {
        var result : AuthResDto? = null
        // Generar el token
        try {
            // Establecemos el algoritmo a utilizar
            val algorithm: Algorithm = Algorithm.HMAC256(JWT_SECRET)
            // Agregar en el token el subject y el rol
            val token: String = JWT.create()
                    .withSubject(subject)
                    .withExpiresAt(Date(System.currentTimeMillis() + expirationTimeInSeconds * 1000))
                    .withIssuer("PWNCRACK")
                    .withClaim("rol", rol)
                    .sign(algorithm)

            // Refresh token
            val refreshToken: String = JWT.create()
                    .withSubject(subject)
                    .withExpiresAt(Date(System.currentTimeMillis() + expirationTimeInSeconds * 1000 * 2))
                    .withIssuer("PWNCRACK")
                    .withClaim("refresh", true)
                    .withClaim("rol", rol)
                    .sign(algorithm)

            // Asignamos el token y el refresh token al objeto de respuesta
            result = AuthResDto(token, refreshToken)
        } catch (exception: JWTCreationException) {
            // Invalid Signing configuration
            println("Ocurrió un error al generar el token")
            LOGGER.error("Ocurrió un error al generar el token", exception)
            //throw FrankieException("Ocurrió un error al autenticar al usuario", exception)
        }
        return result
    }







}