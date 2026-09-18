package com.progresshub.category;

import com.progresshub.category.dto.CategoryResponse;
import com.progresshub.category.dto.CreateCategoryRequest;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @PostMapping
    public CategoryResponse createCategory(
            Authentication authentication,
            @Valid @RequestBody CreateCategoryRequest request
    ) {

        String userEmail = authentication.getName();

        Category category = categoryService.createCategory(
                userEmail,
                request
        );

        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getCreatedAt(),
                category.getUpdatedAt()
        );
    }
}