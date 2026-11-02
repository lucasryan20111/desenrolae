package com.desenrolae.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "goals")
public class Goal {

    @Id
    private String id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    private GoalType type = GoalType.HOURS;

    @Enumerated(EnumType.STRING)
    private GoalPeriod period = GoalPeriod.SEMANAL;

    private double targetValue; // ex: 5 (horas) ou 10 (exercícios)
    private double currentValue;

    private String subjectId;
    private LocalDate startDate;
    private LocalDate dueDate;

    @Enumerated(EnumType.STRING)
    private GoalStatus status = GoalStatus.EM_ANDAMENTO;

    private LocalDateTime createdAt = LocalDateTime.now();

    public enum GoalType { HOURS, TASKS, EXERCISES }
    public enum GoalPeriod { DIARIO, SEMANAL, MENSAL }
    public enum GoalStatus { EM_ANDAMENTO, CONCLUIDA, EXPIRADA }

    public Goal() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public GoalType getType() { return type; }
    public void setType(GoalType type) { this.type = type; }

    public GoalPeriod getPeriod() { return period; }
    public void setPeriod(GoalPeriod period) { this.period = period; }

    public double getTargetValue() { return targetValue; }
    public void setTargetValue(double targetValue) { this.targetValue = targetValue; }

    public double getCurrentValue() { return currentValue; }
    public void setCurrentValue(double currentValue) { this.currentValue = currentValue; }

    public String getSubjectId() { return subjectId; }
    public void setSubjectId(String subjectId) { this.subjectId = subjectId; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public GoalStatus getStatus() { return status; }
    public void setStatus(GoalStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
