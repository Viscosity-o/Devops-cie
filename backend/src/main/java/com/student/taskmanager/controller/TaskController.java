package com.student.taskmanager.controller;

import com.student.taskmanager.dto.ApiResponse;
import com.student.taskmanager.dto.TaskDto;
import com.student.taskmanager.entity.Task;
import com.student.taskmanager.entity.User;
import com.student.taskmanager.repository.TaskRepository;
import com.student.taskmanager.repository.UserRepository;
import com.student.taskmanager.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<TaskDto>> getTasks(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Task> tasks = taskRepository.findByUserOrderByCreatedAtDesc(user);
        List<TaskDto> dtos = tasks.stream()
                .map(t -> new TaskDto(t.getId(), t.getTitle(), t.getSubject(), t.getDescription(), t.getPriority(), t.getDueDate(), t.isCompleted()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    @PostMapping
    public ResponseEntity<TaskDto> createTask(@AuthenticationPrincipal UserDetailsImpl userDetails, @RequestBody TaskDto taskDto) {
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Task task = new Task(
                taskDto.getTitle(),
                taskDto.getSubject(),
                taskDto.getDescription(),
                taskDto.getPriority() != null ? taskDto.getPriority() : "medium",
                taskDto.getDueDate(),
                taskDto.isCompleted(),
                user
        );

        Task saved = taskRepository.save(task);
        return ResponseEntity.ok(new TaskDto(saved.getId(), saved.getTitle(), saved.getSubject(), saved.getDescription(), saved.getPriority(), saved.getDueDate(), saved.isCompleted()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTask(@AuthenticationPrincipal UserDetailsImpl userDetails, @PathVariable Long id, @RequestBody TaskDto taskDto) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!task.getUser().getId().equals(userDetails.getId())) {
            return ResponseEntity.status(403).body(new ApiResponse(false, "Unauthorized access to task"));
        }

        task.setTitle(taskDto.getTitle());
        task.setSubject(taskDto.getSubject());
        task.setDescription(taskDto.getDescription());
        task.setPriority(taskDto.getPriority());
        task.setDueDate(taskDto.getDueDate());
        task.setCompleted(taskDto.isCompleted());

        Task updated = taskRepository.save(task);
        return ResponseEntity.ok(new TaskDto(updated.getId(), updated.getTitle(), updated.getSubject(), updated.getDescription(), updated.getPriority(), updated.getDueDate(), updated.isCompleted()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@AuthenticationPrincipal UserDetailsImpl userDetails, @PathVariable Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!task.getUser().getId().equals(userDetails.getId())) {
            return ResponseEntity.status(403).body(new ApiResponse(false, "Unauthorized access to task"));
        }

        taskRepository.delete(task);
        return ResponseEntity.ok(new ApiResponse(true, "Task deleted successfully"));
    }
}
