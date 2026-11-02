package com.desenrolae.controller;

import com.desenrolae.model.Task;
import com.desenrolae.repository.TaskRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {

    private final TaskRepository repository;

    public TaskController(TaskRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Task> listAll() {
        return repository.findAll();
    }

    @GetMapping("/by-subject/{subjectId}")
    public List<Task> listBySubject(@PathVariable String subjectId) {
        return repository.findBySubjectId(subjectId);
    }

    @PostMapping
    public Task create(@RequestBody Task task) {
        if (task.getId() == null || task.getId().isBlank()) {
            task.setId("task_" + System.currentTimeMillis());
        }
        task.setProgress(task.getProgress());
        return repository.save(task);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> update(@PathVariable String id, @RequestBody Task updated) {
        return repository.findById(id).map(task -> {
            task.setTitle(updated.getTitle());
            task.setDescription(updated.getDescription());
            task.setSubjectId(updated.getSubjectId());
            task.setTopicId(updated.getTopicId());
            task.setStartDate(updated.getStartDate());
            task.setDueDate(updated.getDueDate());
            task.setPriority(updated.getPriority());
            task.setEstimatedMinutes(updated.getEstimatedMinutes());
            task.setStudiedMinutes(updated.getStudiedMinutes());
            task.setNotes(updated.getNotes());
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
