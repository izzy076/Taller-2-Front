import { TestBed } from "@angular/core/testing";
import { LoginService } from "./login.service";
// configurar el cliente HTTP
import { provideHttpClient } from "@angular/common/http";
// herramientas para SIMULAR las solicitudes HTTP
import { provideHttpClientTesting, HttpTestingController } from "@angular/common/http/testing";


// definir el grupo de pruebas
describe("Pruebas del servicio de Login", () => {

    // 1. Definir nuestros muck -> simulación relacionada con peticiones a una Api

    let httpMock: HttpTestingController;
    let service: LoginService;
    const credencialMock = {
        email: "pepita@gmail.com",
        password: "123"
    }
    const tokenMock = "jnpinawobozwbnsrvzwsmbvyvukckv"

    beforeEach(() => {
        // 1.1 Configuración inicial del entorno de pruebas - OBLIGATORIO
        TestBed.configureTestingModule({
            providers: [
                LoginService,
                provideHttpClient(),
                provideHttpClientTesting()
            ]
        })

        httpMock = TestBed.inject(HttpTestingController);
        service = TestBed.inject(LoginService);

    });

    // 2. Definir los casos de prueba

    // Caso 1: Simular la petición POST para iniciar sesión
    it("Caso 1: Simular la petición POST para iniciar sesión", () => {
        const apiUrl = "http://localhost:9000/iniciarSesion"
        const responseMock = { "mensaje": "inicio de sesión exitoso" }

        service.login(credencialMock.email, credencialMock.password).subscribe(
            (res) => {
                expect(res).toEqual(responseMock);
            }
        )

        // simulación de petición a un back
        const req = httpMock.expectOne(apiUrl) //esa simulación se espera que sea igual a la url dada
        expect(req.request.method).toBe("POST")
        req.flush(responseMock)
    });

    it("Caso 2: Obtener token", () => {
        localStorage.setItem("token", tokenMock);
        expect(service.getToken()).toBe(tokenMock) // me debe traer exactamente el mismo token que se guarda en el local Storage
    });
    it("Caso 3: Verificar si está logueado o no", () => {
        localStorage.setItem("token", tokenMock);
        expect(service.isLoggedIn()).toBeTrue();
    });
    it("Caso 4: Verificar si se cierra sesión", () => {
        localStorage.setItem("token", tokenMock);
        service.logout(); // Primero cierro sesión 
        expect(localStorage.getItem("token")).toBeNull();
    });

})