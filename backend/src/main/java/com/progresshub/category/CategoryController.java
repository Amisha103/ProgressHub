package com.progresshub.category;

import com.progresshub.category.dto.CategoryResponse;
import com.progresshub.category.dto.CreateCategoryRequest;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

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
    @GetMapping
    public List<CategoryResponse> getCategories(
            Authentication authentication
    ) {

        String userEmail = authentication.getName();

        List<Category> categories =
                categoryService.getCategories(userEmail);

        return categories.stream()
                .map(category -> new CategoryResponse(
                        category.getId(),
                        category.getName(),
                        category.getCreatedAt(),
                        category.getUpdatedAt()
                ))
                .toList();
    }

    @PutMapping("/{id}")
    public CategoryResponse updateCategory(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody CreateCategoryRequest request
    ) {

        String userEmail = authentication.getName();

        Category category = categoryService.updateCategory(
                userEmail,
                id,
                request
        );

        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getCreatedAt(),
                category.getUpdatedAt()
        );
    }

    @DeleteMapping("/{id}")
    public void deleteCategory(
            Authentication authentication,
            @PathVariable Long id
    ) {

        String userEmail = authentication.getName();

        categoryService.deleteCategory(
                userEmail,
                id
        );
    }
}