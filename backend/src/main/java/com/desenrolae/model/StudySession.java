package com.desenrolae.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "study_sessions")
public class StudySession {

    @Id
    private String id;

    @Column(nullable = false)
    private String subjectId;

    private String taskId;

    @Column(nullable = false)
    private int durationMinutes;

    private LocalDate date = LocalDate.now();
    private LocalDateTime startedAt;
    private LocalDateTime endedAt;

    private String type = "pomodoro"; // pomodoro | cronometro | manual
    private String notes;

    public StudySession() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getSubjectId() { return subjectId; }
    public void setSubjectId(String subjectId) { this.subjectId = subjectId; }

    public String getTaskId() { return taskId; }
    public void setTaskId(String taskId) { this.taskId = taskId; }

    public int getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(int durationMinutes) { this.durationMinutes = durationMinutes; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public LocalDateTime getStartedAt() { return startedAt; }
    public void setStartedAt(LocalDateTime startedAt) { this.startedAt = startedAt; }

    public LocalDateTime getEndedAt() { return endedAt; }
    public void setEndedAt(LocalDateTime endedAt) { this.endedAt = endedAt; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
