# GUIA DE DESENVOLVIMENTO: DESENROLAE NO INTELLIJ IDEA COM JAVA

Este guia foi elaborado especialmente para desenvolvedores **Java** que utilizam o **IntelliJ IDEA** (Community ou Ultimate Edition) para criar, executar e manter o aplicativo **DESENROLAE**.

---

## 🧭 Visão Geral da Arquitetura

Você tem duas formas de trabalhar com este projeto no IntelliJ IDEA:

1. **Opção A (Frontend Direto no IntelliJ)**: Executar a interface web React + TypeScript usando o Node.js e o Terminal Integrado do IntelliJ IDEA.
2. **Opção B (Full-Stack Corporativo Java + Spring Boot)**: Uma API REST desenvolvida em **Java (Spring Boot 3 + Spring Data JPA + Maven/Gradle)** servindo como backend e o **React Vite** como frontend.

Abaixo estão os dois passos a passo detalhados.

---

## 🖥️ PARTE 1: Executando o Frontend no IntelliJ IDEA (Passo a Passo)

### 1. Pré-requisitos instalados na máquina:
- **JDK 17 ou 21** (Amazon Corretto, Eclipse Temurin ou Oracle OpenJDK).
- **Node.js LTS (v18 ou superior)**: Necessário para empacotar o React. (Verifique com `node -v` no terminal).
- **IntelliJ IDEA** (Community ou Ultimate).

### 2. Abrindo o projeto no IntelliJ IDEA:
1. Abra o **IntelliJ IDEA**.
2. Na tela inicial (Welcome Screen), clique em **Open** (ou no menu superior: `File > Open...`).
3. Navegue até a pasta do projeto `desenrolae` e clique em **OK**.
4. Quando o IntelliJ perguntar *"Trust Project?"*, selecione **Trust Project**.

### 3. Configurando a execução via Interface do IntelliJ (Sem precisar decorar comandos):
1. No canto esquerdo do IntelliJ, abra a árvore do projeto e clique com o botão direito no arquivo **`package.json`**.
2. Selecione a opção **Show npm Scripts** (ou abra a aba lateral **npm** que aparecerá à direita ou inferior).
3. O IntelliJ listará os scripts:
   - `dev` (Inicia o servidor de desenvolvimento)
   - `test` (Executa os testes das regras de negócio)
   - `build` (Compila a aplicação para produção)
4. Dê **dois cliques** sobre o script **`dev`**!
5. O painel inferior do IntelliJ iniciará o servidor exibindo:
   ```text
   VITE ready in 250 ms
   ➜ Local: http://localhost:3000/
   ```
6. Clique no link `http://localhost:3000/` diretamente no terminal do IntelliJ para abrir o aplicativo no seu navegador.

---

## ☕ PARTE 2: Criando o Backend em Java (Spring Boot) no IntelliJ IDEA

Se você deseja persistir os dados em um banco de dados relacional (como PostgreSQL, MySQL ou H2) utilizando a stack clássica de mercado em Java, organize o projeto em uma estrutura multi-módulo ou pasta compartilhada:

```text
desenrolae-project/
├── backend/                       ← Projeto Java (Spring Boot + Maven)
│   ├── pom.xml
│   └── src/main/java/com/desenrolae/
│       ├── DesenrolaeApplication.java
│       ├── model/
│       │   ├── Subject.java
│       │   ├── Task.java
│       │   └── Goal.java
│       ├── repository/
│       │   ├── SubjectRepository.java
│       │   └── TaskRepository.java
│       ├── service/
│       │   └── StudyCalculationService.java
│       └── controller/
│           ├── SubjectController.java
│           └── TaskController.java
│
└── frontend/                      ← Código React + TypeScript do Desenrolae
    ├── package.json
    ├── src/
    └── vite.config.ts
```

---

### Código Java de Exemplo (Pronto para Uso)

#### 1. Entidade de Tarefa (`Task.java`)
```java
package com.desenrolae.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String subjectId;

    private String topicId;
    private LocalDate startDate;
    private LocalDate dueDate;

    @Enumerated(EnumType.STRING)
    private Priority priority = Priority.MEDIA;

    @Enumerated(EnumType.STRING)
    private TaskStatus status = TaskStatus.NAO_INICIADA;

    private int progress = 0; // 0 a 100
    private int estimatedMinutes = 60;
    private int studiedMinutes = 0;

    private LocalDateTime completedAt;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    public enum Priority { BAIXA, MEDIA, ALTA }
    public enum TaskStatus { NAO_INICIADA, EM_ANDAMENTO, CONCLUIDA }

    // Regra de Negócio: Atualizar Status Automaticamente com base na Porcentagem
    public void setProgress(int progress) {
        this.progress = Math.min(100, Math.max(0, progress));
        if (this.progress == 0) {
            this.status = TaskStatus.NAO_INICIADA;
            this.completedAt = null;
        } else if (this.progress == 100) {
            this.status = TaskStatus.CONCLUIDA;
            if (this.completedAt == null) {
                this.completedAt = LocalDateTime.now();
            }
        } else {
            this.status = TaskStatus.EM_ANDAMENTO;
            this.completedAt = null;
        }
        this.updatedAt = LocalDateTime.now();
    }

    // Getters e Setters habituais
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getSubjectId() { return subjectId; }
    public void setSubjectId(String subjectId) { this.subjectId = subjectId; }
    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
    public int getProgress() { return progress; }
    public TaskStatus getStatus() { return status; }
    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }
    public int getEstimatedMinutes() { return estimatedMinutes; }
    public void setEstimatedMinutes(int estimatedMinutes) { this.estimatedMinutes = estimatedMinutes; }
    public int getStudiedMinutes() { return studiedMinutes; }
    public void setStudiedMinutes(int studiedMinutes) { this.studiedMinutes = studiedMinutes; }
}
```

---

#### 2. Serviço de Regras de Negócio e Cálculos em Java (`StudyCalculationService.java`)
```java
package com.desenrolae.service;

import com.desenrolae.model.Task;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class StudyCalculationService {

    /**
     * Calcula o progresso percentual médio de um conjunto de tarefas (0 a 100%).
     */
    public int calculateAverageProgress(List<Task> tasks) {
        if (tasks == null || tasks.isEmpty()) {
            return 0;
        }
        double sum = tasks.stream().mapToInt(Task::getProgress).sum();
        return (int) Math.round(sum / tasks.size());
    }

    /**
     * Identifica se uma tarefa está atrasada.
     */
    public boolean isOverdue(Task task, LocalDate referenceDate) {
        if (task.getDueDate() == null || task.getStatus() == Task.TaskStatus.CONCLUIDA) {
            return false;
        }
        return task.getDueDate().isBefore(referenceDate);
    }
}
```

---

#### 3. Controller REST (`TaskController.java`)
```java
package com.desenrolae.controller;

import com.desenrolae.model.Task;
import com.desenrolae.repository.TaskRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:3000") // Permite chamadas do frontend Vite
public class TaskController {

    private final TaskRepository repository;

    public TaskController(TaskRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Task> listAll() {
        return repository.findAll();
    }

    @PostMapping
    public Task create(@RequestBody Task task) {
        task.setProgress(task.getProgress());
        return repository.save(task);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> update(@PathVariable String id, @RequestBody Task updated) {
        return repository.findById(id).map(task -> {
            task.setTitle(updated.getTitle());
            task.setSubjectId(updated.getSubjectId());
            task.setDueDate(updated.getDueDate());
            task.setPriority(updated.getPriority());
            task.setEstimatedMinutes(updated.getEstimatedMinutes());
            task.setStudiedMinutes(updated.getStudiedMinutes());
            task.setProgress(updated.getProgress());
            return ResponseEntity.ok(repository.save(task));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
```

---

## ⚡ 3. Como Rodar Tudo Junto no IntelliJ IDEA com 1 Clique (Compound Run Configuration)

No IntelliJ IDEA Ultimate ou Community:
1. Vá no menu superior: **Run > Edit Configurations...**
2. Clique no ícone **+** e selecione **Compound**.
3. Dê o nome de **"Desenrolae Full App"**.
4. Adicione as duas tarefas:
   - A aplicação Java (`Spring Boot Application` ou `Application: DesenrolaeApplication`).
   - O comando npm (`npm dev`).
5. Clique em **Apply** e **OK**.
6. Agora, basta clicar no botão verde de **Play (▶)** no topo do IntelliJ IDEA para que o Backend Java e a Interface Web subam simultaneamente!
