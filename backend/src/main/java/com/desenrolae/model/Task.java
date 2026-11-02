package com.desenrolae.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "tasks")
public class Task {

    @Id
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

    private int progress = 0; // 0 a 100%
    private int estimatedMinutes = 60;
    private int studiedMinutes = 0;

    private String notes;
    private LocalDateTime completedAt;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    public enum Priority { BAIXA, MEDIA, ALTA }
    public enum TaskStatus { NAO_INICIADA, EM_ANDAMENTO, CONCLUIDA }

    public Task() {}

    // Regra matemática e de negócio: 0% = não iniciada, 1..99% = em andamento, 100% = concluída
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

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getSubjectId() { return subjectId; }
    public void setSubjectId(String subjectId) { this.subjectId = subjectId; }

    public String getTopicId() { return topicId; }
    public void setTopicId(String topicId) { this.topicId = topicId; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }

    public TaskStatus getStatus() { return status; }
    public void setStatus(TaskStatus status) { this.status = status; }

    public int getProgress() { return progress; }

    public int getEstimatedMinutes() { return estimatedMinutes; }
    public void setEstimatedMinutes(int estimatedMinutes) { this.estimatedMinutes = estimatedMinutes; }

    public int getStudiedMinutes() { return studiedMinutes; }
    public void setStudiedMinutes(int studiedMinutes) { this.studiedMinutes = studiedMinutes; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
