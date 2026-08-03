package com.abber.backend.config;

import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI abberOpenAPI() {

        return new OpenAPI()

                .info(new Info()

                        .title("ABBER API")

                        .description("Business Ideation and Mentorship Platform")

                        .version("1.0.0")

                        .contact(new Contact()

                                .name("ABBER Team")

                                .email("support@abber.com")))

                .externalDocs(new ExternalDocumentation()

                        .description("ABBER Documentation"));

    }

}