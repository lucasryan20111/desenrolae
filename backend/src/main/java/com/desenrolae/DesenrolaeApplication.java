package com.desenrolae;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DesenrolaeApplication {

    public static void main(String[] args) {
        SpringApplication.run(DesenrolaeApplication.class, args);
        System.out.println("=================================================");
        System.out.println("🚀 DESENROLAE API (Spring Boot) iniciada com sucesso!");
        System.out.println("📡 Endpoints REST: http://localhost:8080/api");
        System.out.println("🗄️ Console do Banco H2: http://localhost:8080/h2-console");
        System.out.println("=================================================");
    }
}
