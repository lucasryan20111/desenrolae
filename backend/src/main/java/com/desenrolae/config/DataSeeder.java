package com.desenrolae.config;

import com.desenrolae.model.*;
import com.desenrolae.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner initDatabase(
            SubjectRepository subjectRepo,
            TaskRepository taskRepo,
            GoalRepository goalRepo,
            StudySessionRepository sessionRepo
    ) {
        return args -> {
            if (subjectRepo.count() > 0) return;

            System.out.println("🌱 Semeando dados iniciais idênticos à interface de demonstração...");

            // Disciplinas idênticas à demonstração
            Subject s1 = new Subject("sub_faculdade", "FACULDADE", "Engenharia de Software e matérias acadêmicas", "#EF4444", "GraduationCap");
            Subject s2 = new Subject("sub_ingles", "INGLÊS", "Fluência técnica e conversação diária", "#EC4899", "Languages");
            Subject s3 = new Subject("sub_filosofia", "FILOSOFIA PRÁTICA", "Modelos mentais e estoicismo aplicado", "#6366F1", "BookOpen");
            Subject s4 = new Subject("sub_concursos", "CONCURSOS", "Preparação para carreiras públicas de TI", "#06B6D4", "Trophy");
            Subject s5 = new Subject("sub_sistemas", "SISTEMAS DISTRIBUÍDOS", "Consenso, mensageria e alta disponibilidade", "#8B5CF6", "Network");
            Subject s6 = new Subject("sub_dados", "ESTRUTURA DE DADOS", "Árvores, grafos e algoritmos de busca", "#F59E0B", "Binary");
            Subject s7 = new Subject("sub_cripto", "CRIPTOGRAFIA E SEGURANÇA", "TLS 1.3, curvas elípticas e autenticação", "#10B981", "Shield");
            Subject s8 = new Subject("sub_compiladores", "COMPILADORES", "Análise léxica, sintática e LLVM", "#F43F5E", "Cpu");

            // Tópicos
            s4.addTopic(new Topic("top_redes", "Redes & Protocolos TCP/IP", s4));
            s5.addTopic(new Topic("top_raft", "Algoritmo Raft & Consenso", s5));
            s7.addTopic(new Topic("top_rsa", "Curvas Elípticas Ed25519", s7));

            subjectRepo.save(s1);
            subjectRepo.save(s2);
            subjectRepo.save(s3);
            subjectRepo.save(s4);
            subjectRepo.save(s5);
            subjectRepo.save(s6);
            subjectRepo.save(s7);
            subjectRepo.save(s8);

            // Tarefas idênticas
            LocalDate today = LocalDate.now();

            Task t1 = new Task();
            t1.setId("task_1");
            t1.setTitle("Resolver 20 questões de Redes de Computadores");
            t1.setSubjectId("sub_concursos");
            t1.setTopicId("top_redes");
            t1.setStartDate(today.minusDays(3));
            t1.setDueDate(today);
            t1.setPriority(Task.Priority.ALTA);
            t1.setProgress(75);
            t1.setEstimatedMinutes(90);
            t1.setStudiedMinutes(70);
            taskRepo.save(t1);

            Task t2 = new Task();
            t2.setId("task_2");
            t2.setTitle("Implementar Algoritmo Raft para Eleição de Líder");
            t2.setSubjectId("sub_sistemas");
            t2.setTopicId("top_raft");
            t2.setStartDate(today.minusDays(4));
            t2.setDueDate(today.plusDays(2));
            t2.setPriority(Task.Priority.ALTA);
            t2.setProgress(45);
            t2.setEstimatedMinutes(180);
            t2.setStudiedMinutes(85);
            taskRepo.save(t2);

            Task t3 = new Task();
            t3.setId("task_3");
            t3.setTitle("Estudo de Curvas Elípticas (Ed25519 vs Secp256k1)");
            t3.setSubjectId("sub_cripto");
            t3.setTopicId("top_rsa");
            t3.setStartDate(today.minusDays(2));
            t3.setDueDate(today.plusDays(1));
            t3.setPriority(Task.Priority.MEDIA);
            t3.setProgress(80);
            t3.setEstimatedMinutes(105);
            t3.setStudiedMinutes(86);
            taskRepo.save(t3);

            Task t4 = new Task();
            t4.setId("task_4");
            t4.setTitle("Prática de Listening em Inglês Técnico");
            t4.setSubjectId("sub_ingles");
            t4.setStartDate(today.minusDays(5));
            t4.setDueDate(today.minusDays(1)); // Atrasada
            t4.setPriority(Task.Priority.ALTA);
            t4.setProgress(50);
            t4.setEstimatedMinutes(60);
            t4.setStudiedMinutes(30);
            taskRepo.save(t4);

            Task t5 = new Task();
            t5.setId("task_5");
            t5.setTitle("Revisão de Árvores AVL: Rotações Simples e Duplas");
            t5.setSubjectId("sub_dados");
            t5.setStartDate(today.minusDays(6));
            t5.setDueDate(today.minusDays(2));
            t5.setPriority(Task.Priority.MEDIA);
            t5.setProgress(100); // Concluída
            t5.setEstimatedMinutes(120);
            t5.setStudiedMinutes(125);
            taskRepo.save(t5);

            // Metas Semanais idênticas
            Goal g1 = new Goal();
            g1.setId("goal_1");
            g1.setTitle("Criptografia e Segurança Semanal");
            g1.setType(Goal.GoalType.HOURS);
            g1.setPeriod(Goal.GoalPeriod.SEMANAL);
            g1.setTargetValue(1.75); // 1h45m
            g1.setCurrentValue(1.43); // 1h26m -> 82%
            g1.setSubjectId("sub_cripto");
            g1.setStartDate(today.minusDays(4));
            g1.setDueDate(today.plusDays(3));
            goalRepo.save(g1);

            // Sessões de Estudo
            StudySession sess1 = new StudySession();
            sess1.setId("sess_1");
            sess1.setSubjectId("sub_concursos");
            sess1.setTaskId("task_1");
            sess1.setDurationMinutes(70);
            sess1.setDate(today);
            sess1.setStartedAt(LocalDateTime.now().minusMinutes(70));
            sess1.setEndedAt(LocalDateTime.now());
            sessionRepo.save(sess1);

            System.out.println("✅ Base de dados Java inicializada com sucesso!");
        };
    }
}
