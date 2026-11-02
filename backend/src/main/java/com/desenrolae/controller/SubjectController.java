package com.desenrolae.controller;

import com.desenrolae.model.Subject;
import com.desenrolae.repository.SubjectRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subjects")
@CrossOrigin(origins = "*")
public class SubjectController {

    private final SubjectRepository repository;

    public SubjectController(SubjectRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Subject> listAll() {
        return repository.findAll();
    }

    @PostMapping
    public Subject create(@RequestBody Subject subject) {
        if (subject.getId() == null || subject.getId().isBlank()) {
            subject.setId("sub_" + System.currentTimeMillis());
        }
        return repository.save(subject);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Subject> update(@PathVariable String id, @RequestBody Subject updated) {
        return repository.findById(id).map(subject -> {
            subject.setName(updated.getName());
            subject.setDescription(updated.getDescription());
            subject.setColor(updated.getColor());
            subject.setIcon(updated.getIcon());
            return ResponseEntity.ok(repository.save(subject));
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
