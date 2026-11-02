package com.desenrolae.repository;

import com.desenrolae.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, String> {
    List<Task> findBySubjectId(String subjectId);
    List<Task> findByStatus(Task.TaskStatus status);
}
